---
name: Don't duplicate db.ts or migration files
description: Never create a new Prisma client / db.ts when one already exists; never write SQL into existing migration files
type: feedback
---

Do NOT create a new `lib/prisma.ts` or `db.ts` when one already exists. The project has `db` exported from `@rocket-house-productions/integration/server` — import from there.

**Why:** User already has a singleton Prisma client with the right adapter/accelerate setup. Duplicating it creates two connection pools and confuses the codebase.

**How to apply:** Before writing any Prisma client setup code, grep for existing `db` exports. If one exists, use it.

---

Do NOT append SQL to existing migration files. If schema needs a new model, only update `schema.prisma`. The user runs the migration themselves (`prisma migrate dev`).

**Why:** Manually editing a migration file breaks the migration hash check and corrupts the migration history.

**How to apply:** Schema additions go in `schema.prisma` only. Never touch `migration.sql` files.