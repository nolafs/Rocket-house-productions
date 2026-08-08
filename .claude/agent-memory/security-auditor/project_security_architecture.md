---
name: Security Architecture Overview
description: Key security libraries, auth patterns, and control flow for the kids-guitar-dojo app
type: project
---

Authentication is handled by Clerk (`@clerk/nextjs`). Route protection uses Clerk middleware on `(protected)` route groups. Server actions call `auth()` from Clerk to get `userId`.

Authorization for admin operations checks `sessionClaims.metadata.role === 'admin'`.

Database access is via Prisma ORM (`@rocket-house-productions/prisma-client`) using the singleton `db` from `libs/shared/integration/src/db.ts`. All queries use parameterized Prisma calls — no raw SQL injection risk observed.

Stripe webhook validation is done via the `svix` library (signature verification on CLERK_WEBHOOK_SECRET). The Clerk webhook handler at `apps/kids-guitar-dojo/src/app/api/webhook/clerk/route.ts` is correctly verified.

Email marketing integration uses MailerLite via `@mailerlite/mailerlite-nodejs` SDK.

**Why:** Established for context when auditing future auth, payment, or webhook code.
**How to apply:** When reviewing new API routes, check whether `auth()` is called and userId is scoped to the request. For admin routes, also verify sessionClaims role check.
