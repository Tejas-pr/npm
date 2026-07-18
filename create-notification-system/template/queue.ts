import { Queue, Worker, type ConnectionOptions } from "bullmq";
import type { NotificationChannel, NotificationJob } from "./types";
import type { NotificationAdapter } from "./adapters/types";

const QUEUE_NAME = "notifications";

export function createNotificationQueue(connection: ConnectionOptions) {
  return new Queue<NotificationJob>(QUEUE_NAME, {
    connection,
    defaultJobOptions: {
      attempts: 5,
      backoff: { type: "exponential", delay: 2000 },
      // Keep a short tail of finished jobs for debugging without letting
      // Redis grow unbounded.
      removeOnComplete: { count: 1000 },
      removeOnFail: { count: 1000 },
    },
  });
}

/**
 * One worker processes every "slow vendor I/O" channel (email/SMS/WhatsApp/
 * web push) — the adapter for the job's channel does the actual send.
 */
export function createNotificationWorker(
  connection: ConnectionOptions,
  adapters: Partial<Record<NotificationChannel, NotificationAdapter>>
) {
  return new Worker<NotificationJob>(
    QUEUE_NAME,
    async (job) => {
      const adapter = adapters[job.data.channel];
      if (!adapter) {
        throw new Error(`No adapter registered for channel ${job.data.channel}`);
      }

      const result = await adapter.send(job.data);
      if (!result.ok) {
        console.error(
          `[notifications] ${job.data.channel} failed for user ${job.data.userId}: ${result.error}`
        );
        // ponytail: fixed 5-attempt exponential backoff for every channel;
        // split per-channel retry policy if a provider's failure profile
        // ever needs something different.
        if (result.retryable) throw new Error(result.error);
      }
    },
    { connection, concurrency: 5 }
  );
}
