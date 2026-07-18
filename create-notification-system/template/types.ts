export type NotificationChannel =
  | "IN_APP"
  | "EMAIL"
  | "SMS"
  | "WHATSAPP"
  | "WEB_PUSH";

/** A single channel-delivery attempt, handed to an adapter's `send()`. */
export interface NotificationJob {
  id: string; // deterministic: `${eventId}_${channel}` — BullMQ dedupes on this
  eventId: string;
  userId: string;
  channel: NotificationChannel;
  type: string;
  title: string;
  body: string;
  data?: unknown; // JSON-serializable; the host app's repository owns the actual storage type
  /** Resolved email/phone/push-subscription for this channel — null if unavailable. */
  contact?: string | null;
}

/** A persisted bell notification — one row per event, not per channel. */
export interface NotificationRecord {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  data?: unknown;
  readAt: Date | null;
  createdAt: Date;
}

/** What a caller passes to `NotificationService.notify()`. */
export interface NotificationEvent {
  type: string; // registered in registry.ts, e.g. "booking.confirmed"
  userId: string;
  title: string;
  body: string;
  data?: unknown;
  /** Bypasses preference opt-out — for security/legal notices only. */
  critical?: boolean;
  /** Overrides the registry's default channel list for this one call. */
  channels?: NotificationChannel[];
}
