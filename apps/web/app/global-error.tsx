'use client'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  console.error('Global application error:', error)

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-red-50">
          <div className="max-w-md text-center">
            <h1 className="text-3xl font-bold text-red-600 mb-4">
              Application Error
            </h1>
            <p className="text-gray-700 mb-6">
              A critical error occurred. Please try refreshing the page.
            </p>
            <div className="space-y-4">
              <button
                onClick={reset}
                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Reset Application
              </button>
              <button
                onClick={() => window.location.reload()}
                className="block w-full px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Refresh Page
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                  Error Details (Development Only)
                </summary>
                <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto">
                  {error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      </body>
    </html>
  )
}