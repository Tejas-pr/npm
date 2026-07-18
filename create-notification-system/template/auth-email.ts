import { render } from "@react-email/render";
import * as React from "react";
import VerificationEmail from "./emails/verification-email";
import ResetPasswordEmail from "./emails/reset-password-email";
import { getTransporter, fromAddress, isProd } from "./mailer";

// ─── ANSI colour helpers ───────────────────────────────────────────────────────
const c = {
  reset:   "\x1b[0m",
  bold:    "\x1b[1m",
  dim:     "\x1b[2m",
  // foreground
  black:   "\x1b[30m",
  red:     "\x1b[31m",
  green:   "\x1b[32m",
  yellow:  "\x1b[33m",
  blue:    "\x1b[34m",
  magenta: "\x1b[35m",
  cyan:    "\x1b[36m",
  white:   "\x1b[37m",
  // background
  bgBlack:   "\x1b[40m",
  bgRed:     "\x1b[41m",
  bgGreen:   "\x1b[42m",
  bgYellow:  "\x1b[43m",
  bgBlue:    "\x1b[44m",
  bgMagenta: "\x1b[45m",
  bgCyan:    "\x1b[46m",
  bgWhite:   "\x1b[47m",
}

const W = 56 // box width

function pad(str: string, width: number) {
  return str + " ".repeat(Math.max(0, width - str.length))
}

function line(left: string, right?: string) {
  const inner = right
    ? `${c.bold}${c.cyan}${left}${c.reset}  ${c.white}${right}${c.reset}`
    : `${c.dim}${left}${c.reset}`
  const raw = right ? `${left}  ${right}` : left
  const padding = W - raw.length - 2 // 2 for "│ " prefix
  return `${c.dim}│${c.reset} ${inner}${" ".repeat(Math.max(0, padding))} ${c.dim}│${c.reset}`
}

const OTP_TYPE_LABELS: Record<string, { label: string; icon: string; bg: string }> = {
  "sign-in":            { label: "Magic Sign-In",    icon: "🔑", bg: c.bgBlue    },
  "email-verification": { label: "Email Verify",     icon: "✉️ ", bg: c.bgGreen   },
  "forget-password":    { label: "Password Reset",   icon: "🔒", bg: c.bgMagenta },
}

function logOtpEmail(to: string, otp: string, type: string) {
  const meta = OTP_TYPE_LABELS[type] ?? { label: type, icon: "📧", bg: c.bgCyan }
  const typeTag = `${meta.bg}${c.black}${c.bold} ${meta.icon}  ${meta.label} ${c.reset}`
  const top    = `${c.dim}┌${"─".repeat(W)}┐${c.reset}`
  const mid    = `${c.dim}├${"─".repeat(W)}┤${c.reset}`
  const bot    = `${c.dim}└${"─".repeat(W)}┘${c.reset}`
  const blank  = `${c.dim}│${" ".repeat(W)}│${c.reset}`

  const header = `${c.dim}│${c.reset}  ${typeTag}${" ".repeat(W - 2 - meta.label.length - 4)} ${c.dim}│${c.reset}`
  const otpDisplay = `${c.bgBlack} ${c.yellow}${c.bold} ${otp} ${c.reset}`

  console.log(`\n${top}`)
  console.log(header)
  console.log(mid)
  console.log(line("To",   to))
  console.log(line("Type", `${meta.icon}  ${meta.label}`))
  console.log(blank)
  console.log(`${c.dim}│${c.reset}  ${c.dim}Code:${c.reset}  ${otpDisplay}${" ".repeat(W - 8 - otp.length)} ${c.dim}│${c.reset}`)
  console.log(blank)
  console.log(`${c.dim}│${c.reset}  ${c.dim}${pad("No email sent — NODE_ENV is not 'production'", W - 2)}${c.reset}${c.dim}│${c.reset}`)
  console.log(`${bot}\n`)
}

function logResetEmail(to: string, url: string) {
  const top   = `${c.dim}┌${"─".repeat(W)}┐${c.reset}`
  const mid   = `${c.dim}├${"─".repeat(W)}┤${c.reset}`
  const bot   = `${c.dim}└${"─".repeat(W)}┘${c.reset}`
  const blank = `${c.dim}│${" ".repeat(W)}│${c.reset}`
  const typeTag = `${c.bgMagenta}${c.black}${c.bold} 🔒  Password Reset ${c.reset}`

  const header = `${c.dim}│${c.reset}  ${typeTag}${" ".repeat(W - 2 - "🔒  Password Reset".length - 2)} ${c.dim}│${c.reset}`

  // Break URL across multiple lines if too long
  const urlLines: string[] = []
  let remaining = url
  while (remaining.length > 0) {
    urlLines.push(remaining.slice(0, W - 4))
    remaining = remaining.slice(W - 4)
  }

  console.log(`\n${top}`)
  console.log(header)
  console.log(mid)
  console.log(line("To", to))
  console.log(blank)
  console.log(`${c.dim}│${c.reset}  ${c.dim}Reset URL:${c.reset}`)
  for (const chunk of urlLines) {
    console.log(`${c.dim}│${c.reset}  ${c.cyan}${chunk}${c.reset}`)
  }
  console.log(blank)
  console.log(`${c.dim}│${c.reset}  ${c.dim}${pad("No email sent — NODE_ENV is not 'production'", W - 2)}${c.reset}${c.dim}│${c.reset}`)
  console.log(`${bot}\n`)
}

// ─── Public API ────────────────────────────────────────────────────────────────
// Auth-critical emails (OTP, password reset) are sent directly — never queued.
// They sit on the synchronous "user is staring at the enter-code screen"
// path, and unlike registry-driven notifications they aren't preference-
// driven or skippable, so routing them through the BullMQ pipeline would
// only add a failure mode (worker down = no OTP) for no benefit.

export const sendOTP = async ({
  email,
  otp,
  type,
}: {
  email: string;
  otp: string;
  type: string;
}) => {
  if (!isProd) {
    logOtpEmail(email, otp, type);
    return { messageId: "dev-mode-no-email-sent" };
  }

  let subject = "";
  let text = "";

  if (type === "sign-in") {
    subject = "Touch Up — Your Sign-In Code";
    text = `Your sign-in code is: ${otp}`;
  } else if (type === "email-verification") {
    subject = "Touch Up — Verify your email";
    text = `Your email verification code is: ${otp}`;
  } else if (type === "forget-password") {
    subject = "Touch Up — Reset your password";
    text = `Your password reset code is: ${otp}`;
  } else {
    subject = "Touch Up — Your Code";
    text = `Your code is: ${otp}`;
  }

  const html = await render(React.createElement(VerificationEmail, { otp, type }));

  const info = await getTransporter().sendMail({
    from: fromAddress(),
    to: email,
    subject,
    text,
    html,
  });

  console.log(`[email] OTP sent to ${email} — messageId: ${info.messageId}`);
  return info;
};

export const sendResetPasswordEmail = async ({
  email,
  url,
}: {
  email: string;
  url: string;
}) => {
  if (!isProd) {
    logResetEmail(email, url);
    return { messageId: "dev-mode-no-email-sent" };
  }

  const html = await render(React.createElement(ResetPasswordEmail, { url }));

  const info = await getTransporter().sendMail({
    from: fromAddress(),
    to: email,
    subject: "Touch Up — Reset your password",
    text: `Click the following link to reset your password: ${url}`,
    html,
  });

  console.log(`[email] Reset link sent to ${email} — messageId: ${info.messageId}`);
  return info;
};
