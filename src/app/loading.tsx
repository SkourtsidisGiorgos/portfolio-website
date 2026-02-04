/**
 * Global loading state for the application.
 * Displays an animated skeleton while the main page loads.
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Hero skeleton */}
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {/* Animated background pulse */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-violet-500/5" />
          <div className="absolute top-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute right-1/4 bottom-1/4 h-96 w-96 animate-pulse rounded-full bg-violet-500/10 blur-3xl delay-150" />
        </div>

        {/* Content skeleton */}
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          {/* Name skeleton */}
          <div className="mx-auto mb-4 h-16 w-96 max-w-full animate-pulse rounded-lg bg-white/5" />

          {/* Title skeleton */}
          <div className="mx-auto mb-6 h-8 w-72 max-w-full animate-pulse rounded-lg bg-white/5" />

          {/* Description skeleton */}
          <div className="mx-auto mb-8 space-y-2">
            <div className="mx-auto h-4 w-full max-w-lg animate-pulse rounded bg-white/5" />
            <div className="mx-auto h-4 w-4/5 max-w-md animate-pulse rounded bg-white/5" />
          </div>

          {/* Button skeleton */}
          <div className="flex justify-center gap-4">
            <div className="h-12 w-36 animate-pulse rounded-lg bg-cyan-500/20" />
            <div className="h-12 w-36 animate-pulse rounded-lg bg-white/10" />
          </div>
        </div>

        {/* Loading spinner */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-3">
            <div className="relative h-12 w-12">
              <div className="absolute inset-0 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
              <div className="absolute inset-2 animate-spin rounded-full border-2 border-violet-500 border-b-transparent [animation-direction:reverse] [animation-duration:1.5s]" />
            </div>
            <span className="animate-pulse text-sm text-gray-500">
              Loading experience...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
