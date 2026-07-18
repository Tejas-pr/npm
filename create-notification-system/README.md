# create-notification-system

A scaffolding tool for setting up a scalable notification system in Node.js applications. 
This tool automatically copies necessary source files, injects dependencies, and configures environment variables so you can start sending emails, SMS, and managing queues instantly.

## Usage

You can run this tool using `npx` (or `bunx`, `pnpm dlx`, `yarn dlx`) directly from your terminal:

```bash
npx create-notification-system
```

### What it does

When you run the command, it will:
1. **Prompt for Destination**: Ask where you want to install the notification system.
   - If you are in a monorepo, it suggests `./packages/notifications`.
   - If you are in a standalone app, it suggests `./src/notifications`.
2. **Copy Files**: Copies all necessary modules (mailer, queue, dispatcher, adapters, etc.) into the chosen directory.
3. **Inject Dependencies**: Detects your package manager (npm, pnpm, yarn, bun) and automatically installs the required dependencies (e.g. `bullmq`, `nodemailer`, `twilio`, `@react-email/components`, etc.).
4. **Environment Setup**: Appends required variables (`REDIS_URL`, `SMTP_HOST`, `TWILIO_SID`, etc.) to your `.env` file with placeholder values.

## Configuration

After running the command, be sure to update your `.env` file with your actual credentials:

```env
# Notification System Credentials
REDIS_URL="redis://localhost:6379"
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_USER="your-smtp-user"
SMTP_PASS="your-smtp-pass"
SMTP_FROM="noreply@example.com"
TWILIO_ACCOUNT_SID="your-twilio-sid"
TWILIO_AUTH_TOKEN="your-twilio-token"
TWILIO_PHONE_NUMBER="+1234567890"
```

## How to use the Notification System

Once installed, you can import and use the dispatcher in your Node.js application:

```typescript
import { NotificationDispatcher } from './notifications/dispatcher';

const dispatcher = new NotificationDispatcher();

// Queue a notification
await dispatcher.dispatch({
  userId: 'user-123',
  type: 'WELCOME_EMAIL',
  payload: { name: 'Tejas' }
});
```

Make sure you have Redis running locally (or pointing to your remote Redis instance) for BullMQ to process the jobs.

## Development

If you'd like to develop this CLI tool locally:

```bash
git clone <repo-url>
cd create-notification-system
npm install
npm link
```
Then you can run `create-notification-system` from any local directory to test it.
