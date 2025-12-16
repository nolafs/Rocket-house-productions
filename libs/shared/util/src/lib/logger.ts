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
    typeof window === 'undefined' ? process.env.LOG_LEVEL : (process.env.NEXT_PUBLIC_LOG_LEVEL as string | undefined);
  if (!raw) return typeof window === 'undefined' ? 'info' : 'debug'; // default: server=info, client=debug (dev-friendly)
  const v = raw.toLowerCase();
  if (v === 'debug' || v === 'info' || v === 'warn' || v === 'error' || v === 'off') return v as LogLevel;
  return 'info';
}

const CURRENT_LEVEL = getEnvLevel();

function shouldLog(level: LogLevel) {
  return LEVEL_ORDER[level] <= LEVEL_ORDER[CURRENT_LEVEL];
}

function safeStringify(...args: unknown[]) {
  try {
    return args.map(a => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ');
  } catch {
    // fallback for circular structures
    return args.map(a => (typeof a === 'string' ? a : String(a))).join(' ');
  }
}

export function createLogger(namespace?: string) {
  const prefix = namespace ? `[${namespace}]` : '[app]';

  function debug(...args: unknown[]) {
    if (!shouldLog('debug')) return;
    /* eslint-disable no-console */
    console.debug(prefix, ...args);
  }
  function info(...args: unknown[]) {
    if (!shouldLog('info')) return;
    /* eslint-disable no-console */
    console.info(prefix, ...args);
  }
  function warn(...args: unknown[]) {
    if (!shouldLog('warn')) return;
    /* eslint-disable no-console */
    console.warn(prefix, ...args);
  }
  function error(...args: unknown[]) {
    if (!shouldLog('error')) return;
    /* eslint-disable no-console */
    console.error(prefix, ...args);
  }
  return { debug, info, warn, error };
}

// default logger
export const logger = createLogger();
