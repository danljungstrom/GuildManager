'use client';

/**
 * Global Error Boundary
 * Catches errors in the root layout
 */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '20px',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>
            Critical Error
          </h1>
          <p style={{ color: '#666', marginBottom: '24px' }}>
            Something went wrong with the application
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => window.history.back()}
              style={{
                padding: '12px 24px',
                backgroundColor: 'transparent',
                color: '#000',
                border: '1px solid #ccc',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Go back
            </button>
            <button
              onClick={reset}
              style={{
                padding: '12px 24px',
                backgroundColor: '#000',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
