// logger.ts - put this in a shared utils lib (e.g. libs/shared/utils/src/lib/logger.ts)
type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'off';

const LEVEL_ORDER: Record<LogLevel, number> = {
  off: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
};

function getEnvLevel(): LogLevel {
  // Server: LOG_LEVEL, Client: NEXT_PUBLIC_LOG_LEVEL
  const raw =
    typeof window === 'undefined'
      ? process.env.SERVER_LOG_LEVEL
      : (process.env.NEXT_PUBLIC_LOG_LEVEL as string | undefined);
  if (!raw) return typeof window === 'undefined' ? 'info' : 'debug'; // default: server=info, client=debug (dev-friendly)
  const v = raw.toLowerCase();
  if (v === 'debug' || v === 'info' || v === 'warn' || v === 'error' || v === 'off') return v as LogLevel;
  return 'info';
}

const CURRENT_LEVEL = getEnvLevel();

function shouldLog(level: LogLevel) {
  return LEVEL_ORDER[level] <= LEVEL_ORDER[CURRENT_LEVEL];
}

// Keys that should be redacted when logging
const REDACT_KEYS = [
  'email',
  'password',
  'token',
  'secret',
  'api_key',
  'apikey',
  'access_token',
  'stripe',
  'session',
  'cookie',
  'billingAddress',
  'address',
  'card',
  'card_number',
  'cvv',
];

function isPrimitive(v: unknown) {
  return v === null || typeof v !== 'object';
}

function maskValue(v: string) {
  if (!v) return v;
  // show short prefix for debugging, mask the rest
  if (v.length <= 6) return '***';
  return v.slice(0, 3) + '***' + v.slice(-3);
}

function sanitizeObject(obj: any, depth = 0): any {
  if (depth > 4) return '[MaxDepth]';
  if (obj == null) return obj;
  if (Array.isArray(obj)) return obj.map(i => sanitizeObject(i, depth + 1));
  if (isPrimitive(obj)) return obj;

  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj)) {
    const lk = String(k).toLowerCase();
    if (REDACT_KEYS.some(r => lk.includes(r))) {
      // redact entire value
      if (typeof v === 'string') out[k] = maskValue(v);
      else out[k] = '[REDACTED]';
    } else if (typeof v === 'object' && v !== null) {
      out[k] = sanitizeObject(v, depth + 1);
    } else if (typeof v === 'string' && v.startsWith('http')) {
      // sanitize URL by removing querystring
      try {
        const u = new URL(v);
        u.search = '';
        out[k] = u.toString();
      } catch {
        out[k] = v;
      }
    } else {
      out[k] = v;
    }
  }
  return out;
}

function sanitizeArg(arg: unknown) {
  if (typeof arg === 'string') {
    // sanitize URLs (remove query string)
    if (arg.startsWith('http')) {
      try {
        const u = new URL(arg);
        u.search = '';
        return u.toString();
      } catch {
        return arg;
      }
    }
    // mask token-like strings
    const low = arg.toLowerCase();
    if (REDACT_KEYS.some(k => low.includes(k))) return maskValue(arg);
    return arg;
  }
  if (isPrimitive(arg)) return arg;
  try {
    return sanitizeObject(arg);
  } catch {
    return '[Unserializable]';
  }
}

export function createLogger(namespace?: string) {
  const prefix = namespace ? `[${namespace}]` : '[app]';

  function debug(...args: unknown[]) {
    if (!shouldLog('debug')) return;
    /* eslint-disable no-console */
    const safe = args.map(a => sanitizeArg(a));
    console.debug(prefix, ...safe);
  }
  function info(...args: unknown[]) {
    if (!shouldLog('info')) return;
    /* eslint-disable no-console */
    const safe = args.map(a => sanitizeArg(a));
    console.info(prefix, ...safe);
  }
  function warn(...args: unknown[]) {
    if (!shouldLog('warn')) return;
    /* eslint-disable no-console */
    const safe = args.map(a => sanitizeArg(a));
    console.warn(prefix, ...safe);
  }
  function error(...args: unknown[]) {
    if (!shouldLog('error')) return;
    /* eslint-disable no-console */
    const safe = args.map(a => sanitizeArg(a));
    console.error(prefix, ...safe);
  }
  return { debug, info, warn, error };
}

// default logger
export const logger = createLogger();
