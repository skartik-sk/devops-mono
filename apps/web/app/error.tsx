'use client'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  console.error('Application error:', error)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Something went wrong!
        </h1>
        <p className="text-gray-600 mb-6">
          An error occurred while loading this page.
        </p>
        <div className="space-y-4">
          <button
            onClick={reset}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Try again
          </button>
          <div className="text-xs text-gray-400">
            Error ID: {error.digest}
          </div>
        </div>
      </div>
    </div>
  )
}