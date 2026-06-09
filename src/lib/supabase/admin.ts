import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// 서버 전용. service role 키는 RLS를 우회하므로 절대 클라이언트로 노출 금지
// (SUPABASE_SERVICE_ROLE_KEY 는 NEXT_PUBLIC_ 접두사 없이 서버에만 둔다).

let admin: SupabaseClient | null = null;

export function isAdminConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

export function getSupabaseAdmin(): SupabaseClient | null {
  if (!isAdminConfigured()) return null;
  if (!admin) {
    admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
  }
  return admin;
}
