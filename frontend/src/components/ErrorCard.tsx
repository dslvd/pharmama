'use client'

import { Ban, X } from 'lucide-react'

// card
export function ErrorCard({ err, depth = 0, onClose }: { err: string; depth?: number; onClose?: () => void
}) {
  //transparency of older  errors
  const opacity = depth === 0 ? 1 : Math.max(0.2, 0.8 - depth * 0.2)

  return (
    <div
      className="shadow-sm w-full bg-error/5 backdrop-blur-sm rounded-lg border border-border/50 p-4 transition-all duration-300 pointer-events-auto shrink-0"
      style={{ opacity }}
    >
      <div className="flex items-center gap-2">
        <Ban className="w-4 h-4 text-error/80 shrink-0" />
        <p className="text-sm text-error/90">
          <span className="font-semibold"> Error: </span> {err}
        </p>
        <X
          onClick={onClose}
          className="w-4 h-4 text-error/50 hover:text-error cursor-pointer ml-auto shrink-0 transition-colors"
        />
      </div>
    </div>
  )
}

// stack
export function ErrorStack({
  errors = [],
  onDismiss,
}: {
  errors: { id: string; message: string }[]
  onDismiss?: (id: string) => void
}) {
  if (errors.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 w-full max-w-sm flex flex-col-reverse gap-2 max-h-[80vh] overflow-y-auto pointer-events-none z-50">
      {errors.map((e, i) => {
        const depth = errors.length - 1 - i
        return (
          <ErrorCard
            key={e.id}
            err={e.message}
            depth={depth}
            onClose={() => onDismiss?.(e.id)}
          />
        )
      })}
    </div>
  )
}