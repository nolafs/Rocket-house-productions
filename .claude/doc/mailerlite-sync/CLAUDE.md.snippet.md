# CLAUDE.md — append to the repo root file

Add this section so future Claude Code sessions don't have to rediscover the
constraints. Everything here is a rule that produced a real bug or a real
architectural decision — not general advice.

---

## Marketing sync (MailerLite)

All sync logic lives in `lib/mailerlite-sync.mjs`. The scheduled functions
(`netlify/functions/sync-*.mts`), the admin route
(`app/api/admin/sync/route.ts`), and the CLI are thin wrappers over
`runPush()` / `runPullTags()`. **Never fork this logic** — a manual sync that
behaves differently from the nightly one can't be debugged by inspection.

### Data ownership — one direction per field

| Owner | Fields |
|---|---|
| Database | `lifecycle_stage`, `lessons_done`, `book*_done`, `book*_status`, `book*_owned`, `child_score`, `last_active` |
| MailerLite | survey/marketing tags (`ns_`, `do_`, `cf_`, `replied_`) |

`MarketingProfile.tags` is a **read-only mirror**. Never write it from app
code — the pull phase overwrites it.

### Rules

- **Never read `ChildProgress.replayCount`.** A flawed upsert inflates it to
  unreliable values. Count rows where `isCompleted` is true instead.
- **Free/total lesson counts are always derived from the DB** at run time,
  never hardcoded. Adding a free lesson must not require a deploy.
- **Segmentation belongs in MailerLite, not the codebase.** When a new
  audience rule is needed, push the underlying data as a field and build the
  segment in their UI. Don't add filtering logic here.
- **New MailerLite field ⇒ create it in their UI first.** Unknown fields are
  silently dropped by the API — no error, just permanently empty segments.
- **Adding a book** should require only a new `Book` row with a
  field-name-safe `slug`, plus creating `book<n>_done` / `_status` / `_owned`
  in MailerLite. If it requires code changes, the abstraction has broken.

### Platform constraints

- Netlify scheduled functions have a **30-second limit** and can't be
  background functions. Next.js route handlers on Netlify hit roughly the
  same ceiling — an API route is not a way around it.
- Any long-running phase must accept a `deadline` and stop cleanly. Push
  resumes implicitly (unchanged hashes); pull resumes via a saved cursor.
- Prisma needs `binaryTargets = ["native", "rhel-openssl-3.0.x"]` and a
  **pooled** `DATABASE_URL`. Migrations use `directUrl`.

### Before changing sync behaviour

Run `node lib/mailerlite-sync.mjs --dry-run` and compare the lifecycle
distribution before and after. A change that moves everyone into one bucket
is a bug in the progress query, not a successful refactor.
