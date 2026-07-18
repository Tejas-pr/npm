import twilio from "twilio";
import type { NotificationAdapter, AdapterResult } from "./types";
import type { NotificationJob } from "../types";
import { isProd } from "../mailer";

/**
 * NOTE: WhatsApp Business API only allows freeform replies within 24h of the
 * user's last inbound message — outside that window Twilio requires a
 * pre-approved template message instead of arbitrary text. This adapter
 * sends the raw title/body as-is, which is only valid within that session
 * window; wire up approved templates before relying on this outside it.
 */
export class WhatsappAdapter implements NotificationAdapter {
  readonly channel = "WHATSAPP" as const;
  private client: ReturnType<typeof twilio> | null = null;

  constructor(
    private accountSid: string | undefined,
    private authToken: string | undefined,
    private fromNumber: string | undefined
  ) {}

  private getClient() {
    if (!this.accountSid || !this.authToken || !this.fromNumber) return null;
    if (!this.client) this.client = twilio(this.accountSid, this.authToken);
    return this.client;
  }

  async send(job: NotificationJob): Promise<AdapterResult> {
    if (!job.contact) {
      return { ok: false, error: "no verified phone on file", retryable: false };
    }

    const client = this.getClient();
    if (!client || !isProd) {
      console.log(`[notifications:whatsapp:dev] → ${job.contact} | ${job.title}: ${job.body}`);
      return { ok: true, providerId: "dev-mode-no-whatsapp-sent" };
    }

    try {
      const message = await client.messages.create({
        to: `whatsapp:${job.contact}`,
        from: `whatsapp:${this.fromNumber}`,
        body: `${job.title}\n${job.body}`,
      });
      return { ok: true, providerId: message.sid };
    } catch (error) {
      return { ok: false, error: (error as Error).message, retryable: true };
    }
  }
}
