import type { NotificationAdapter, AdapterResult } from "./types";
import type { NotificationJob } from "../types";

/**
 * The host app's real-time transport (raw `ws`, Socket.IO, Pusher, Ably —
 * whatever it uses) implements just this one method.
 */
export interface RealtimePublisher {
  publish(userId: string, payload: unknown): void;
}

/**
 * Unlike the other channels, this is invoked directly by the dispatcher
 * (not via the BullMQ queue) — a DB write + an in-process socket lookup are
 * fast, non-blocking operations already, no different from any other Prisma
 * write happening directly in a request handler. Only the slow-vendor
 * channels (SMTP, Twilio) go through the worker.
 */
export class InAppAdapter implements NotificationAdapter {
  readonly channel = "IN_APP" as const;

  constructor(private realtime: RealtimePublisher) {}

  async send(job: NotificationJob): Promise<AdapterResult> {
    this.realtime.publish(job.userId, {
      id: job.eventId,
      type: job.type,
      title: job.title,
      body: job.body,
      data: job.data,
    });
    return { ok: true };
  }
}
