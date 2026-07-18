import nodemailer from "nodemailer";

export const isProd = process.env.NODE_ENV === "production";

let transporter: nodemailer.Transporter | null = null;

/**
 * One shared SMTP transporter for every email this package sends — auth
 * OTP/reset emails (auth-email.ts) and registry-driven notification emails
 * (adapters/email.adapter.ts) alike.
 */
export function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }
  return transporter;
}

export function fromAddress() {
  return `"Touch Up" <${process.env.SMTP_USER}>`;
}
