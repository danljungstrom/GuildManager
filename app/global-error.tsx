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
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
