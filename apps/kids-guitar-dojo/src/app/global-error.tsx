// app/global-error.tsx
'use client';

import { useEffect } from 'react';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error:', error);
  }, [error]);

  const handleReload = () => {
    try {
      // Add any cleanup logic here if needed
      reset();
    } catch (err) {
      // Fallback to page reload if reset fails
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Something went wrong</title>
        <style
          dangerouslySetInnerHTML={{
            __html: `
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }

            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .error-container {
              background: white;
              border-radius: 12px;
              box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
              padding: 3rem 2rem;
              max-width: 500px;
              width: 90%;
              text-align: center;
              animation: slideUp 0.5s ease-out;
            }

            @keyframes slideUp {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            .error-icon {
              font-size: 4rem;
              margin-bottom: 1rem;
              color: #f56565;
            }

            .error-title {
              font-size: 2rem;
              font-weight: 700;
              color: #2d3748;
              margin-bottom: 0.5rem;
            }

            .error-subtitle {
              font-size: 1.1rem;
              color: #718096;
              margin-bottom: 2rem;
            }

            .error-details {
              background: #f7fafc;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 1rem;
              margin: 1.5rem 0;
              font-family: 'Monaco', 'Consolas', monospace;
              font-size: 0.9rem;
              color: #e53e3e;
              text-align: left;
              overflow-x: auto;
              max-height: 120px;
              overflow-y: auto;
            }

            .button-group {
              display: flex;
              gap: 1rem;
              justify-content: center;
              flex-wrap: wrap;
              margin-top: 2rem;
            }

            .btn {
              padding: 0.75rem 1.5rem;
              border: none;
              border-radius: 8px;
              font-size: 1rem;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s ease;
              min-width: 120px;
            }

            .btn-primary {
              background: #667eea;
              color: white;
            }

            .btn-primary:hover {
              background: #5a67d8;
              transform: translateY(-1px);
            }

            .btn-secondary {
              background: #e2e8f0;
              color: #4a5568;
            }

            .btn-secondary:hover {
              background: #cbd5e0;
              transform: translateY(-1px);
            }

            .btn:active {
              transform: translateY(0);
            }

            .error-id {
              font-size: 0.8rem;
              color: #a0aec0;
              margin-top: 1.5rem;
              font-family: 'Monaco', 'Consolas', monospace;
            }

            @media (max-width: 480px) {
              .error-container {
                padding: 2rem 1.5rem;
              }

              .error-title {
                font-size: 1.5rem;
              }

              .button-group {
                flex-direction: column;
                align-items: center;
              }

              .btn {
                width: 100%;
                max-width: 200px;
              }
            }
          `,
          }}
        />
      </head>
      <body>
        <div className="error-container">
          <div className="error-icon" role="img" aria-label="Error">
            ⚠️
          </div>

          <h1 className="error-title">Oops! Something went wrong</h1>

          <p className="error-subtitle">
            We are sorry for the inconvenience. An unexpected error occurred while processing your request.
          </p>

          {process.env.NODE_ENV === 'development' && (
            <details className="error-details">
              <summary style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>Error Details (Development)</summary>
              <div>
                <strong>Message:</strong> {error.message || 'Unknown error'}
                {error.digest && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <strong>Digest:</strong> {error.digest}
                  </div>
                )}
                {error.stack && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <strong>Stack:</strong>
                    <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.8rem' }}>{error.stack}</pre>
                  </div>
                )}
              </div>
            </details>
          )}

          <div className="button-group">
            <button className="btn btn-primary" onClick={handleReload} type="button">
              Try Again
            </button>

            <button className="btn btn-secondary" onClick={handleGoHome} type="button">
              Go Home
            </button>
          </div>

          {error.digest && <div className="error-id">Error ID: {error.digest}</div>}
        </div>
      </body>
    </html>
  );
}
