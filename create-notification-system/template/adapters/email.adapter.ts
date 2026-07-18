import { render } from "@react-email/render";
import * as React from "react";
import type { NotificationAdapter, AdapterResult } from "./types";
import type { NotificationJob } from "../types";
import { getTransporter, fromAddress, isProd } from "../mailer";
import NotificationEmail from "../emails/notification-email";

export class EmailAdapter implements NotificationAdapter {
  readonly channel = "EMAIL" as const;

  async send(job: NotificationJob): Promise<AdapterResult> {
    if (!job.contact) {
      return { ok: false, error: "no email on file", retryable: false };
    }

    if (!isProd) {
      console.log(`[notifications:email:dev] → ${job.contact} | ${job.title}\n${job.body}`);
      return { ok: true, providerId: "dev-mode-no-email-sent" };
    }

    try {
      const html = await render(
        React.createElement(NotificationEmail, { title: job.title, body: job.body })
      );
      const info = await getTransporter().sendMail({
        from: fromAddress(),
        to: job.contact,
        subject: job.title,
        text: job.body,
        html,
      });
      return { ok: true, providerId: info.messageId };
    } catch (error) {
      return { ok: false, error: (error as Error).message, retryable: true };
    }
  }
}
