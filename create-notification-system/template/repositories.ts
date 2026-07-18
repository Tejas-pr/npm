import type { NotificationChannel, NotificationRecord } from "./types";

/**
 * Implemented by the host app against its own DB/ORM — this package never
 * imports Prisma directly, so it can be dropped into another project by
 * implementing this interface against whatever that project uses.
 */
export interface NotificationRepository {
  create(input: {
    id: string;
    userId: string;
    type: string;
    title: string;
    body: string;
    data?: unknown;
  }): Promise<NotificationRecord>;
  markRead(id: string, userId: string): Promise<void>;
  markAllRead(userId: string): Promise<void>;
  listForUser(
    userId: string,
    opts: { cursor?: string; limit: number }
  ): Promise<NotificationRecord[]>;
  unreadCount(userId: string): Promise<number>;
}

export interface PreferenceRepository {
  /** Defaults to `true` (opted in) if the user has no explicit preference row. */
  isEnabled(userId: string, channel: NotificationChannel): Promise<boolean>;
  /** Resolved email/phone/push-subscription for this channel, or null if unavailable. */
  getContact(userId: string, channel: NotificationChannel): Promise<string | null>;
}
