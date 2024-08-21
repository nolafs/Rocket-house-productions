export function debounce(func: (...args: any[]) => void, delay: number): () => void {
  let debounceTimer: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]): void {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(this, args), delay);
  };
}
