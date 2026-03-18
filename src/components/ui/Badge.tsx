import { cn } from '@/lib/utils'

type BadgeVariant =
  | 'safe'
  | 'bold'
  | 'controversial'
  | 'insightful'
  | 'curious'
  | 'default'
  | 'pro'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  safe:          'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  bold:          'text-amber-400  bg-amber-500/10  border-amber-500/20',
  controversial: 'text-red-400    bg-red-500/10    border-red-500/20',
  insightful:    'text-blue-400   bg-blue-500/10   border-blue-500/20',
  curious:       'text-violet-400 bg-violet-500/10 border-violet-500/20',
  default:       'text-text-muted bg-surface-hover border-border',
  pro:           'text-primary    bg-primary/[0.08] border-primary/20',
}

export default function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1',
      'text-xs font-semibold px-2 py-0.5 rounded border tracking-wide',
      VARIANT_STYLES[variant],
      className
    )}>
      {children}
    </span>
  )
}
