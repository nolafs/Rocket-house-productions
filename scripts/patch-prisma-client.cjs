/**
 * Patches the generated Prisma client for CJS bundled environments (e.g. Netlify scheduled functions).
 *
 * The generated client sets `globalThis.__dirname` using `fileURLToPath(import.meta.url)`.
 * When esbuild bundles .mts files as CJS, `import.meta.url` is undefined and throws at init.
 * We wrap it in a try/catch so the module loads cleanly under CJS.
 *
 * Run this after `prisma generate`: `node scripts/patch-prisma-client.cjs`
 */

const fs = require('fs');
const path = require('path');

const clientFile = path.join(process.cwd(), 'generated/prisma/client.ts');

if (!fs.existsSync(clientFile)) {
  console.log('⚠  generated/prisma/client.ts not found, skipping patch');
  process.exit(0);
}

let content = fs.readFileSync(clientFile, 'utf8');

const ORIGINAL = "globalThis['__dirname'] = path.dirname(fileURLToPath(import.meta.url))";
const PATCHED   = "try { globalThis['__dirname'] = path.dirname(fileURLToPath(import.meta.url)); } catch (_e) {}";

if (content.includes(PATCHED)) {
  console.log('✓ generated/prisma/client.ts already patched');
} else if (content.includes(ORIGINAL)) {
  fs.writeFileSync(clientFile, content.replace(ORIGINAL, PATCHED));
  console.log('✓ Patched generated/prisma/client.ts: wrapped fileURLToPath in try/catch for CJS compatibility');
} else {
  console.log('⚠  Patch target not found – Prisma may have changed its generated output. Check generated/prisma/client.ts manually.');
}
