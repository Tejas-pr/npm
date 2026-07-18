import type { NotificationChannel } from "./types";

// Same "config map keyed by a const object" shape as StorageModuleConfigs in
// apps/backend/lib/storage/config.ts.
export const NotificationEvents = {
  BOOKING_CONFIRMED: "booking.confirmed",
  BOOKING_CANCELLED: "booking.cancelled",
  BOOKING_STATUS_CHANGED: "booking.status_changed",
  CHAT_NEW_MESSAGE: "chat.new_message",
  ARTIST_APPLICATION_APPROVED: "artist.application.approved",
  ARTIST_APPLICATION_REJECTED: "artist.application.rejected",
  REVIEW_RECEIVED: "review.received",
} as const;

export type NotificationEventType =
  (typeof NotificationEvents)[keyof typeof NotificationEvents];

interface EventConfig {
  channels: NotificationChannel[];
  critical?: boolean;
}

export const NotificationRegistry: Record<string, EventConfig> = {
  [NotificationEvents.BOOKING_CONFIRMED]: { channels: ["IN_APP", "EMAIL"] },
  [NotificationEvents.BOOKING_CANCELLED]: { channels: ["IN_APP", "EMAIL"] },
  [NotificationEvents.BOOKING_STATUS_CHANGED]: { channels: ["IN_APP"] },
  // Chat already has its own real-time UX (socket push + unread badges in
  // the conversation list) — deliberately not wired into the bell to avoid
  // double-notifying. Registered here so it's available if a future need
  // (e.g. push while the app is backgrounded) wants it.
  [NotificationEvents.CHAT_NEW_MESSAGE]: { channels: ["IN_APP"] },
  [NotificationEvents.ARTIST_APPLICATION_APPROVED]: { channels: ["IN_APP", "EMAIL"] },
  [NotificationEvents.ARTIST_APPLICATION_REJECTED]: { channels: ["IN_APP", "EMAIL"] },
  [NotificationEvents.REVIEW_RECEIVED]: { channels: ["IN_APP"] },
};

const DEFAULT_CHANNELS: NotificationChannel[] = ["IN_APP"];

export function resolveChannels(
  type: string,
  override?: NotificationChannel[]
): NotificationChannel[] {
  if (override) return override;
  return NotificationRegistry[type]?.channels ?? DEFAULT_CHANNELS;
}

export function isCritical(type: string): boolean {
  return NotificationRegistry[type]?.critical ?? false;
}
