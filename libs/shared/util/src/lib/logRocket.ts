import LogRocket from 'logrocket';

export function initLogRocket(apiKey: string) {
  if (typeof window !== 'undefined') {
    LogRocket.init(apiKey, {
      network: {
        requestSanitizer: request => {
          // Don't let LogRocket intercept Next.js server action requests —
          // its fetch patch in v12 interferes with FormData multipart bodies
          // and causes 403s on server actions.
          if (request.headers?.['Next-Action'] || request.headers?.['next-action']) {
            return null;
          }
          return request;
        },
      },
    });
  }
}
