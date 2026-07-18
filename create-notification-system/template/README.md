# notifications

Portable multi-channel notifications (email, SMS, WhatsApp, in-app/bell,
optional web push) with a queue-backed worker for every channel that talks
to a slow external vendor. No dependency on this app's Prisma client,
Express routes, or WebSocket transport — everything crosses those
boundaries through an interface.

See `implementation_plans/notification-system.md` in the repo root for the
full design writeup.

## Porting this to another project

Three integration seams to fill in against the new host app:

1. **`NotificationRepository` + `PreferenceRepository`** (`repositories.ts`)
   — implement against that app's own DB/ORM. Reference implementation:
   `apps/backend/services/notification.service.ts` (Prisma).
2. **Credentials for whichever adapters you want** — SMTP env vars for
   `EmailAdapter`, Twilio SID/token/from-numbers for `SmsAdapter` /
   `WhatsappAdapter`. An adapter you don't construct is simply never
   registered — no code path references it.
3. **A `RealtimePublisher`** (`adapters/in-app.adapter.ts`) — one method,
   `publish(userId, payload)`. This app implements it over raw `ws`
   (`apps/backend/socket.ts`); a project using Pusher/Ably/Socket.IO just
   implements the same one-method interface instead.
4. **Run the worker as its own process**, pointed at that app's Redis:
   `createNotificationWorker(connection, adapters)`. See
   `apps/backend/workers/notification.worker.ts`.

No Prisma, Express, or `ws` import anywhere in this package — grep for
`import` in any file here and everything not from `types.ts`/`registry.ts`
is either a public npm package (`bullmq`, `nodemailer`, `twilio`,
`@react-email/*`) or another file in this same package.

## Why IN_APP isn't queued

Every channel implements the same `NotificationAdapter` interface, but
`NotificationService.notify()` (`dispatcher.ts`) only enqueues the
vendor-I/O channels (`EMAIL`, `SMS`, `WHATSAPP`, `WEB_PUSH`) onto BullMQ.
`IN_APP` is invoked directly and synchronously — a DB insert plus an
in-process socket lookup are fast operations already, not slow vendor calls,
and queuing them would require the worker process (which doesn't hold any
open sockets) to reach back into the API process's connections, adding
cross-process complexity for zero benefit.

## Deliberate simplifications

- One `Notification` DB row per **event**, not per channel — the bell reads
  one row; per-channel delivery success/failure is logged to the console,
  not persisted (first metric worth wiring up if you need it, not built).
- No generic multi-provider failover — one Twilio adapter covers SMS +
  WhatsApp. Swap it for MSG91/Gupshup/etc. by writing a new file matching
  the same `NotificationAdapter` interface, not by building an abstraction
  layer speculatively.
- No web push adapter wired into the default registry — the interface
  exists (`WEB_PUSH` is a valid channel), but no host app in this repo has a
  service worker to receive it yet.
