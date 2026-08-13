---
name: Recurring Vulnerability Patterns
description: Patterns of security issues observed across audits of this codebase
type: project
---

## Pattern 1: Missing ownership checks on purchase mutations
`submitOnBoardingAction` (review/actions.ts) extracts a purchaseId from `baseUrl` passed in from the client, then updates the purchase without verifying that the purchase belongs to the authenticated user's account. An attacker can submit any purchaseId to attach their child to someone else's purchase record.

## Pattern 2: Unauthenticated Stripe checkout URL endpoint
`/api/stripe/checkurl/route.ts` accepts `productId` and `userId` from the request body without calling `auth()`. Any unauthenticated caller can trigger Stripe checkout session creation (creates DB Orders records) for arbitrary product IDs.

## Pattern 3: Free course bypass via automatic purchase creation
`get-child.ts` creates a free purchase for any authenticated user accessing any course slug with no entitlement check. Combined with Pattern 1, this may be abused for unauthorized course access.

## Pattern 4: getOrders / getTransactions accept arbitrary userId from caller
`getOrders(userId)` and `getTransactions(userId)` take userId as a parameter without internally calling `auth()`. If a caller passes another user's ID, the function will return that user's financial records.

**Why:** Documented after 2026-08-04 audit of stripe/enrollment/orders code.
**How to apply:** Flag any server action or API route that takes an ID from client input and uses it for DB lookups without first verifying the session user owns that resource.
