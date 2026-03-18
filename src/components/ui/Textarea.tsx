import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-text-muted">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            'w-full bg-surface border border-border rounded-input px-3 py-2.5 text-sm text-text',
            'placeholder:text-text-subtle',
            'transition-colors duration-100 resize-none',
            'focus:outline-none focus:border-border-focus focus:shadow-input-focus',
            error
              ? 'border-danger focus:border-danger'
              : 'hover:border-border-hover',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-danger mt-0.5">{error}</p>}
        {hint && !error && <p className="text-xs text-text-muted mt-0.5">{hint}</p>}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
export default Textarea
