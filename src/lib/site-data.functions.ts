import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
}

export const getSiteData = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicClient();
  const [services, plans, settings, payments] = await Promise.all([
    supabase.from("services").select("*").eq("active", true).order("order_index"),
    supabase.from("pricing_plans").select("*").eq("active", true).order("order_index"),
    supabase.from("site_settings").select("*"),
    supabase.from("payment_methods").select("*").eq("active", true).order("order_index"),
  ]);
  const settingsMap: Record<string, string> = {};
  for (const row of settings.data ?? []) settingsMap[row.key] = row.value;
  return {
    services: services.data ?? [],
    plans: plans.data ?? [],
    settings: settingsMap,
    payments: payments.data ?? [],
  };
});