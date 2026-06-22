import React from 'react'

// Shimmer animation via Tailwind's animate-pulse
const shimmer = 'bg-white/5 animate-pulse rounded-2xl'

export function GalleryCardSkeleton() {
  return (
    <div className={`${shimmer} break-inside-avoid`} style={{ height: '260px' }} />
  )
}

export function GalleryGridSkeleton({ count = 6 }) {
  return (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
      {[...Array(count)].map((_, i) => (
        <GalleryCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function TableRowSkeleton({ cols = 5 }) {
  return (
    <tr className="border-b border-white/5">
      {[...Array(cols)].map((_, i) => (
        <td key={i} className="p-4">
          <div className={`h-4 ${shimmer}`} style={{ width: `${60 + Math.random() * 30}%` }} />
        </td>
      ))}
    </tr>
  )
}

export function CommentSkeleton() {
  return (
    <div className="flex gap-3">
      <div className={`w-8 h-8 rounded-xl shrink-0 ${shimmer}`} />
      <div className="flex-1 space-y-2">
        <div className={`h-3 ${shimmer}`} style={{ width: '30%' }} />
        <div className={`h-3 ${shimmer}`} style={{ width: '90%' }} />
        <div className={`h-3 ${shimmer}`} style={{ width: '70%' }} />
      </div>
    </div>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-4">
      <div className={`w-12 h-12 rounded-xl ${shimmer}`} />
      <div className={`h-8 ${shimmer}`} style={{ width: '50%' }} />
      <div className={`h-3 ${shimmer}`} style={{ width: '70%' }} />
    </div>
  )
}

export function MediaCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/3">
      <div className={`aspect-video ${shimmer} rounded-none`} />
      <div className="p-3 space-y-2">
        <div className={`h-3 ${shimmer}`} style={{ width: '80%' }} />
        <div className={`h-2 ${shimmer}`} style={{ width: '40%' }} />
      </div>
    </div>
  )
}
