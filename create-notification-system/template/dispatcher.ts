import type { Queue } from "bullmq";
import type { Redis } from "ioredis";
import type { NotificationChannel, NotificationEvent, NotificationJob } from "./types";
import { resolveChannels, isCritical } from "./registry";
import type { NotificationRepository, PreferenceRepository } from "./repositories";
import type { NotificationAdapter } from "./adapters/types";

// Channels that need real vendor I/O go through the queue/worker. IN_APP is
// handled synchronously — see adapters/in-app.adapter.ts for why.
const QUEUED_CHANNELS: NotificationChannel[] = ["EMAIL", "SMS", "WHATSAPP", "WEB_PUSH"];

// Per-user-per-hour cap on the channels that cost real money, so a bug that
// fires an event in a loop can't rack up a Twilio bill overnight.
const RATE_LIMITED_CHANNELS: NotificationChannel[] = ["SMS", "WHATSAPP"];
const MAX_PER_HOUR = 10;

export class NotificationService {
  constructor(
    private repo: NotificationRepository,
    private prefs: PreferenceRepository,
    private inAppAdapter: NotificationAdapter,
    private queue: Queue<NotificationJob>,
    private redis?: Redis
  ) {}

  async notify(event: NotificationEvent): Promise<void> {
    const critical = event.critical ?? isCritical(event.type);
    const requested = resolveChannels(event.type, event.channels);

    const enabled: NotificationChannel[] = [];
    for (const channel of requested) {
      if (critical || (await this.prefs.isEnabled(event.userId, channel))) {
        enabled.push(channel);
      }
    }
    if (enabled.length === 0) return;

    // One row per event (not per channel) — this is what the bell reads.
    // Persisted regardless of which channels end up actually delivering.
    const record = await this.repo.create({
      id: crypto.randomUUID(),
      userId: event.userId,
      type: event.type,
      title: event.title,
      body: event.body,
      data: event.data,
    });

    if (enabled.includes("IN_APP")) {
      await this.inAppAdapter.send({
        id: `${record.id}_IN_APP`,
        eventId: record.id,
        userId: event.userId,
        channel: "IN_APP",
        type: event.type,
        title: event.title,
        body: event.body,
        data: event.data,
      });
    }

    await Promise.all(
      enabled
        .filter((channel) => QUEUED_CHANNELS.includes(channel))
        .map((channel) => this.enqueueChannel(record.id, event, channel))
    );
  }

  private async enqueueChannel(
    eventId: string,
    event: NotificationEvent,
    channel: NotificationChannel
  ): Promise<void> {
    const contact = await this.prefs.getContact(event.userId, channel);
    if (!contact) return; // no verified contact for this channel — skip silently

    if (!(await this.underRateCap(event.userId, channel))) {
      console.warn(`[notifications] rate cap hit for user ${event.userId} on ${channel}, skipping`);
      return;
    }

    const job: NotificationJob = {
      // BullMQ reserves jobIds containing ":" for its repeatable-job format
      // (requires exactly 3 colon-separated parts) — use "_" instead.
      id: `${eventId}_${channel}`,
      eventId,
      userId: event.userId,
      channel,
      type: event.type,
      title: event.title,
      body: event.body,
      data: event.data,
      contact,
    };

    // Deterministic jobId — re-firing the same event is deduped by BullMQ
    // instead of double-sending.
    await this.queue.add(channel, job, { jobId: job.id });
  }

  private async underRateCap(userId: string, channel: NotificationChannel): Promise<boolean> {
    if (!this.redis || !RATE_LIMITED_CHANNELS.includes(channel)) return true;

    const bucket = Math.floor(Date.now() / 3_600_000);
    const key = `notif:rate:${userId}:${channel}:${bucket}`;
    const count = await this.redis.incr(key);
    if (count === 1) await this.redis.expire(key, 3600);
    return count <= MAX_PER_HOUR;
  }
}
