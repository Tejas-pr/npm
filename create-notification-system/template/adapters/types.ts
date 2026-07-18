import type { NotificationChannel, NotificationJob } from "../types";

export type AdapterResult =
  | { ok: true; providerId?: string }
  | { ok: false; error: string; retryable: boolean };

/** Every channel (email, SMS, WhatsApp, in-app, web push) implements this. */
export interface NotificationAdapter {
  readonly channel: NotificationChannel;
  send(job: NotificationJob): Promise<AdapterResult>;
}
