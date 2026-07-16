/**
 * Public runtime config (Vite).
 * For real Google/GitHub OAuth, set:
 *   VITE_SUPABASE_URL=
 *   VITE_SUPABASE_ANON_KEY=
 * and enable providers in the Supabase dashboard.
 */
export const ENV = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL as string | undefined,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined,
  appUrl: (import.meta.env.VITE_APP_URL as string | undefined) || window.location.origin,
  isSocialOAuthEnabled: Boolean(
    import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
  ),
} as const;
