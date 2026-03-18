import { useEffect, useState } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { useToastStore, type ToastItem } from '@/store/toast'
import { cn } from '@/lib/utils'

function Toast({ toast, onRemove }: { toast: ToastItem; onRemove: () => void }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Trigger enter animation
    const t = setTimeout(() => setVisible(true), 10)
    return () => clearTimeout(t)
  }, [])

  const icons = {
    success: <CheckCircle className="w-4 h-4 text-success shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-danger shrink-0" />,
    info: <Info className="w-4 h-4 text-primary shrink-0" />,
  }

  return (
    <div
      className={cn(
        'flex items-center gap-3 bg-surface-elevated border border-border rounded-card px-4 py-3 shadow-card-hover min-w-[240px] max-w-xs transition-all duration-200',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
      )}
    >
      {icons[toast.type]}
      <p className="text-sm text-text flex-1">{toast.message}</p>
      <button
        onClick={onRemove}
        className="text-text-muted hover:text-text transition-colors ml-1"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

export default function Toaster() {
  const { toasts, remove } = useToastStore()

  return (
    <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className="pointer-events-auto">
          <Toast toast={t} onRemove={() => remove(t.id)} />
        </div>
      ))}
    </div>
  )
}
