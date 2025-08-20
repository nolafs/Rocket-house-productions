import LogRocket from 'logrocket';

export function initLogRocket(apiKey: string) {
  if (typeof window !== 'undefined') {
    LogRocket.init(apiKey); // Replace with your LogRocket app ID
  }
}
