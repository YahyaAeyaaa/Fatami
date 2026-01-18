"use client"

// Spinner Loading - untuk button atau inline loading
export function LoadingSpinner({ size = "md", color = "teal" }) {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-10 h-10 border-3",
    xl: "w-14 h-14 border-4",
  }

  const colors = {
    teal: "border-[#2d8a8a]",
    navy: "border-[#1a2e3b]",
    white: "border-white",
    gray: "border-gray-400",
  }

  return <div className={`${sizes[size]} ${colors[color]} border-t-transparent rounded-full animate-spin`} />
}

// Dots Loading - animasi 3 titik
export function LoadingDots({ color = "teal" }) {
  const colors = {
    teal: "bg-[#2d8a8a]",
    navy: "bg-[#1a2e3b]",
    gray: "bg-gray-400",
  }

  return (
    <div className="flex items-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`w-2.5 h-2.5 rounded-full ${colors[color]} animate-bounce`}
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  )
}

// Pulse Loading - untuk card atau content placeholder
export function LoadingPulse({ className = "" }) {
  return <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />
}

// Skeleton Loading - untuk text placeholder
export function LoadingSkeleton({ lines = 3, avatar = false }) {
  return (
    <div className="flex gap-4">
      {avatar && <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse shrink-0" />}
      <div className="flex-1 space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`h-4 bg-gray-200 rounded-md animate-pulse ${i === lines - 1 ? "w-3/4" : "w-full"}`}
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    </div>
  )
}

// Card Skeleton - untuk card content
export function LoadingCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gray-200 animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded-md animate-pulse w-1/2" />
          <div className="h-3 bg-gray-200 rounded-md animate-pulse w-1/3" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded-md animate-pulse w-full" />
        <div className="h-3 bg-gray-200 rounded-md animate-pulse w-5/6" />
        <div className="h-3 bg-gray-200 rounded-md animate-pulse w-4/6" />
      </div>
    </div>
  )
}

// Table Skeleton - untuk loading table
export function LoadingTableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div
        className="grid gap-4 p-4 border-b border-gray-100 bg-gray-50"
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded-md animate-pulse" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid gap-4 p-4 border-b border-gray-50 last:border-b-0"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={colIndex}
              className="h-4 bg-gray-200 rounded-md animate-pulse"
              style={{ animationDelay: `${(rowIndex * columns + colIndex) * 0.05}s` }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

// Full Page Loading - untuk loading seluruh halaman
export function LoadingFullPage({ text = "Memuat..." }) {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-200 rounded-full" />
        <div className="absolute inset-0 w-16 h-16 border-4 border-[#2d8a8a] border-t-transparent rounded-full animate-spin" />
      </div>
      <p className="text-gray-600 font-medium">{text}</p>
    </div>
  )
}

// Overlay Loading - untuk loading dengan overlay gelap
export function LoadingOverlay({ text = "Memproses..." }) {
  return (
    <div className="absolute inset-0 bg-[#1a2e3b]/50 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-3 rounded-2xl">
      <LoadingSpinner size="lg" color="white" />
      <p className="text-white font-medium">{text}</p>
    </div>
  )
}

// Button Loading - wrapper untuk button dengan loading state
