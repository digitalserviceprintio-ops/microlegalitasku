import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ShieldCheck, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ensureAdmin } from "@/lib/admin.functions";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Login Admin — Legalin Care" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const bootstrap = useServerFn(ensureAdmin);
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // Idempotent: ensures admin account exists with default credentials
      await bootstrap();
      const email = username.includes("@") ? username : `${username}@legalin.care`;
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate({ to: "/admin" });
    } catch (err: any) {
      setError(err?.message ?? "Login gagal");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[image:var(--gradient-soft)] px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[image:var(--gradient-hero)] text-primary-foreground shadow-[var(--shadow-elegant)]">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold">Legalin Care</span>
        </div>
        <div className="rounded-3xl border border-border bg-card p-7 shadow-[var(--shadow-elegant)]">
          <h1 className="text-xl font-bold">Login Admin</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Masuk untuk mengelola layanan, harga & pengaturan.
          </p>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
                className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            {error && (
              <div className="flex items-start gap-2 rounded-xl bg-destructive/10 p-3 text-xs text-destructive">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[image:var(--gradient-hero)] py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-card)] transition hover:opacity-90 disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Login
            </button>
          </form>
          <div className="mt-5 rounded-xl bg-secondary/60 p-3 text-xs text-muted-foreground">
            <div className="font-semibold text-foreground">Kredensial default:</div>
            <div>Username: <code className="font-mono">admin</code></div>
            <div>Password: <code className="font-mono">Superadmin</code></div>
          </div>
        </div>
      </div>
    </div>
  );
}