import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          // Base
          'relative inline-flex items-center justify-center gap-2 font-medium rounded-btn',
          'transition-all duration-150 select-none',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',

          // Variants
          variant === 'primary' && [
            'bg-primary-gradient text-white shadow-card',
            'hover:brightness-[1.08] hover:shadow-card-hover',
            'active:scale-[0.98] active:brightness-95',
          ],
          variant === 'secondary' && [
            'bg-surface border border-border text-text shadow-card',
            'hover:bg-surface-hover hover:border-border-hover',
            'active:scale-[0.99]',
          ],
          variant === 'ghost' && [
            'text-text-muted hover:text-text hover:bg-surface-hover',
            'active:scale-[0.99]',
          ],
          variant === 'danger' && [
            'bg-danger text-white',
            'hover:brightness-110',
            'active:scale-[0.98]',
          ],

          // Sizes
          size === 'sm' && 'text-xs px-3 py-1.5 h-7',
          size === 'md' && 'text-sm px-4 py-2 h-9',
          size === 'lg' && 'text-[15px] px-5 py-2.5 h-10',

          className
        )}
        {...props}
      >
        {/* Loading spinner — absolutely positioned so button width stays stable */}
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          </span>
        )}
        <span className={cn('inline-flex items-center gap-2', loading && 'invisible')}>
          {children}
        </span>
      </button>
    )
  }
)

Button.displayName = 'Button'
export default Button
