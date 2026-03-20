import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  suffix?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, suffix, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-text-muted">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full bg-surface border border-border rounded-input px-3 py-2.5 text-sm text-text',
              'placeholder:text-text-subtle',
              'transition-colors duration-100',
              'focus:outline-none focus:border-border-focus focus:shadow-input-focus',
              error
                ? 'border-danger focus:border-danger'
                : 'hover:border-border-hover',
              suffix && 'pr-9',
              className
            )}
            {...props}
          />
          {suffix && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-2.5">
              {suffix}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-danger mt-0.5">{error}</p>}
        {hint && !error && <p className="text-xs text-text-muted mt-0.5">{hint}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input
