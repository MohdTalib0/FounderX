/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  /** Paddle.js client token (Dashboard → Developer tools → Authentication) */
  readonly VITE_PADDLE_CLIENT_TOKEN?: string
  /** sandbox | production */
  readonly VITE_PADDLE_ENVIRONMENT?: string
  /** Price id for Starter (pri_…) */
  readonly VITE_PADDLE_PRICE_ID_STARTER?: string
  /** Price id for Pro (pri_…) */
  readonly VITE_PADDLE_PRICE_ID_PRO?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
