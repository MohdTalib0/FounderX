import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CopyButtonProps {
  text: string
  className?: string
  label?: string
  size?: 'sm' | 'md'
  onCopy?: () => void
}

export default function CopyButton({ text, className, label = 'Copy', size = 'md', onCopy }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    onCopy?.()
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-btn border transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        size === 'sm' ? 'text-xs px-2.5 py-1 h-7' : 'text-sm px-3 py-1.5 h-8',
        copied
          ? 'border-success/30 bg-success/[0.08] text-success'
          : 'border-border bg-transparent text-text-muted hover:border-border-hover hover:bg-surface-hover hover:text-text',
        className
      )}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5" />
          Copied
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          {label}
        </>
      )}
    </button>
  )
}
