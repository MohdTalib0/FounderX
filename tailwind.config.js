/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // 5-step type scale — use these, no arbitrary text-[Npx]
        // xs=12  sm=14  base=16  lg=20  xl=28
        // "page" = page-level h1 (22px sits between lg and xl)
        page: ['22px', { lineHeight: '1.25', fontWeight: '600', letterSpacing: '-0.015em' }],
      },
      colors: {
        background: 'var(--color-bg)',
        surface: {
          DEFAULT: 'var(--color-surface)',
          hover:   'var(--color-surface-hover)',
          elevated:'var(--color-surface-elevated)',
        },
        border: {
          DEFAULT: 'var(--color-border)',
          hover:   'var(--color-border-hover)',
          focus:   '#6366F1',
        },
        primary: {
          DEFAULT: '#6366F1',
          hover:   '#7577F3',
          muted:   '#6366F114',
        },
        success: {
          DEFAULT: '#22C55E',
          muted:   '#22C55E14',
        },
        warning: {
          DEFAULT: '#F59E0B',
          muted:   '#F59E0B14',
        },
        danger: {
          DEFAULT: '#EF4444',
          muted:   '#EF444414',
        },
        text: {
          DEFAULT: 'var(--color-text)',
          muted:   'var(--color-text-muted)',
          subtle:  'var(--color-text-subtle)',
        },
      },
      boxShadow: {
        // Elevation tiers — pick ONE per component, don't stack
        // flat (tier 0):     no shadow — secondary cards, list rows
        // raised (tier 1):   card — interactive cards, post results
        // elevated (tier 2): card-hover — hero card, dialogs, modals
        card:        '0 0 0 1px rgba(255,255,255,0.04), 0 1px 3px rgba(0,0,0,0.4)',
        'card-hover':'0 0 0 1px rgba(255,255,255,0.06), 0 4px 12px rgba(0,0,0,0.5)',
        glow:        '0 0 0 3px rgba(99,102,241,0.25)',
        'input-focus':'0 0 0 3px rgba(99,102,241,0.15)',
      },
      borderRadius: {
        card:  '10px',
        btn:   '7px',
        input: '7px',
        pill:  '999px',
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #6d6ff5 0%, #6366F1 100%)',
        'primary-gradient-hover': 'linear-gradient(135deg, #7e80f7 0%, #7577F3 100%)',
        'subtle-grid': `
          linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
        `,
      },
      backgroundSize: {
        grid: '32px 32px',
      },
      animation: {
        'fade-in':    'fadeIn 0.15s ease-out',
        'slide-up':   'slideUp 0.2s ease-out',
        'slide-down': 'slideDown 0.2s ease-out',
        'shimmer':    'shimmer 1.8s ease-in-out infinite',
        'spin-slow':  'spin 1.4s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%':   { opacity: '0', transform: 'translateY(-6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
