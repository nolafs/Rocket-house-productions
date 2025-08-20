// app/global-error.tsx
'use client';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body>
        <main className="p-6">
          <h1>Oops</h1>
          <pre>{error.message}</pre>
          <button onClick={() => reset()}>Reload</button>
        </main>
      </body>
    </html>
  );
}
