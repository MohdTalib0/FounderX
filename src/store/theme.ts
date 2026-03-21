import { create } from 'zustand'

type Theme = 'dark' | 'light'

interface ThemeStore {
  theme: Theme
  toggle: () => void
}

function applyTheme(theme: Theme) {
  const html = document.documentElement
  if (theme === 'dark') {
    html.classList.add('dark')
  } else {
    html.classList.remove('dark')
  }
}

// Apply immediately on module load to avoid flash
const saved = (localStorage.getItem('theme') as Theme) ?? 'dark'
applyTheme(saved)

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: saved,
  toggle: () => set((s) => {
    const next: Theme = s.theme === 'dark' ? 'light' : 'dark'
    localStorage.setItem('theme', next)
    applyTheme(next)
    return { theme: next }
  }),
}))
