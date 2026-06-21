import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const ADMIN_EMAIL = "admin@legalin.care";
const ADMIN_PASSWORD = "Superadmin";

// PUBLIC: idempotent bootstrap so the default admin account always exists.
// Safe because it only ever (re)creates one fixed account.
export const ensureAdmin = createServerFn({ method: "POST" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  // List users and find by email (paginate first page is enough for fresh project)
  const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
  let user = list?.users.find((u) => u.email === ADMIN_EMAIL);

  if (!user) {
    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: { username: "admin" },
    });
    if (error) throw new Error(error.message);
    user = created.user!;
  }

  // Ensure admin role exists
  await supabaseAdmin
    .from("user_roles")
    .upsert({ user_id: user.id, role: "admin" }, { onConflict: "user_id,role" });

  return { ok: true, email: ADMIN_EMAIL };
});

// Helper: throw if caller is not admin
async function assertAdmin(context: { supabase: any; userId: string }) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", context.userId)
    .eq("role", "admin")
    .maybeSingle();
  if (!data) throw new Error("Forbidden");
}

export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    return { isAdmin: !!data };
  });

// Services
const serviceSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(500),
  icon: z.string().min(1).max(50),
  points: z.array(z.string().max(200)).max(10),
  order_index: z.number().int(),
  active: z.boolean(),
});

export const upsertService = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => serviceSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (data.id) {
      const { error } = await supabaseAdmin.from("services").update(data).eq("id", data.id);
      if (error) throw error;
    } else {
      const { error } = await supabaseAdmin.from("services").insert(data);
      if (error) throw error;
    }
    return { ok: true };
  });

export const deleteService = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("services").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

// Pricing
const planSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(100),
  tag: z.string().max(50),
  price: z.string().min(1).max(30),
  description: z.string().min(1).max(300),
  features: z.array(z.string().max(200)).max(10),
  featured: z.boolean(),
  order_index: z.number().int(),
  active: z.boolean(),
});

export const upsertPlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => planSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (data.id) {
      const { error } = await supabaseAdmin.from("pricing_plans").update(data).eq("id", data.id);
      if (error) throw error;
    } else {
      const { error } = await supabaseAdmin.from("pricing_plans").insert(data);
      if (error) throw error;
    }
    return { ok: true };
  });

export const deletePlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("pricing_plans").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

// Settings
export const updateSetting = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ key: z.string().min(1).max(50), value: z.string().max(500) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("site_settings")
      .upsert({ key: data.key, value: data.value }, { onConflict: "key" });
    if (error) throw error;
    return { ok: true };
  });