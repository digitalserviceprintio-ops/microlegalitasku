import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { getSiteData } from "@/lib/site-data.functions";
import {
  checkIsAdmin,
  upsertService,
  deleteService,
  upsertPlan,
  deletePlan,
  updateSetting,
} from "@/lib/admin.functions";
import {
  ShieldCheck, LogOut, Plus, Trash2, Save, Loader2, Package,
  Tag, Settings, ExternalLink,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — Legalin Care" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

type Tab = "services" | "pricing" | "settings";

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const check = useServerFn(checkIsAdmin);
  const load = useServerFn(getSiteData);
  const [tab, setTab] = useState<Tab>("services");
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    check().then((r) => {
      if (!r.isAdmin) navigate({ to: "/auth" });
      else setAuthorized(true);
    }).catch(() => navigate({ to: "/auth" }));
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["site-data-admin"],
    queryFn: () => load(),
    enabled: authorized === true,
  });

  async function handleLogout() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const refresh = () => qc.invalidateQueries({ queryKey: ["site-data-admin"] });

  if (authorized === null) {
    return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[image:var(--gradient-hero)] text-primary-foreground">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-bold leading-tight">Legalin Care</div>
              <div className="text-xs text-muted-foreground">Panel Admin</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className="hidden items-center gap-1 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium transition hover:bg-secondary sm:inline-flex">
              <ExternalLink className="h-3.5 w-3.5" /> Lihat Situs
            </Link>
            <button onClick={handleLogout} className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive transition hover:bg-destructive/20">
              <LogOut className="h-3.5 w-3.5" /> Logout
            </button>
          </div>
        </div>
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-6 pb-2 text-sm">
          {([
            { k: "services", l: "Layanan", icon: Package },
            { k: "pricing", l: "Harga", icon: Tag },
            { k: "settings", l: "Pengaturan", icon: Settings },
          ] as const).map((t) => (
            <button
              key={t.k}
              onClick={() => setTab(t.k)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 font-medium transition ${
                tab === t.k ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              <t.icon className="h-4 w-4" /> {t.l}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {isLoading || !data ? (
          <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : (
          <>
            {tab === "services" && <ServicesManager services={data.services} onChange={refresh} />}
            {tab === "pricing" && <PricingManager plans={data.plans} onChange={refresh} />}
            {tab === "settings" && <SettingsManager settings={data.settings} onChange={refresh} />}
          </>
        )}
      </main>
    </div>
  );
}

function ServicesManager({ services, onChange }: { services: any[]; onChange: () => void }) {
  const save = useServerFn(upsertService);
  const del = useServerFn(deleteService);

  function emptyService() {
    return { title: "", description: "", icon: "FileText", points: [""], order_index: services.length + 1, active: true };
  }
  const [editing, setEditing] = useState<any | null>(null);

  return (
    <div>
      <SectionHead title="Kelola Layanan" desc="Daftar layanan yang tampil di landing page.">
        <button onClick={() => setEditing(emptyService())} className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
          <Plus className="h-4 w-4" /> Layanan Baru
        </button>
      </SectionHead>

      <div className="mt-6 grid gap-4">
        {services.map((s) => (
          <div key={s.id} className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">{s.icon}</span>
                  <h3 className="font-semibold">{s.title}</h3>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {(s.points as string[]).map((p) => (
                    <li key={p} className="rounded-full bg-secondary px-2 py-0.5 text-xs">{p}</li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => setEditing(s)} className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium transition hover:bg-secondary">Edit</button>
                <button
                  onClick={async () => { if (confirm(`Hapus "${s.title}"?`)) { await del({ data: { id: s.id } }); onChange(); } }}
                  className="inline-flex items-center justify-center gap-1 rounded-lg bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive transition hover:bg-destructive/20"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <EditorModal title={editing.id ? "Edit Layanan" : "Layanan Baru"} onClose={() => setEditing(null)}>
          <ServiceForm
            initial={editing}
            onSubmit={async (v) => { await save({ data: v }); setEditing(null); onChange(); }}
          />
        </EditorModal>
      )}
    </div>
  );
}

function ServiceForm({ initial, onSubmit }: { initial: any; onSubmit: (v: any) => Promise<void> }) {
  const [v, setV] = useState({ ...initial, points: [...(initial.points ?? [])] });
  const [saving, setSaving] = useState(false);
  return (
    <form
      onSubmit={async (e) => { e.preventDefault(); setSaving(true); try { await onSubmit({ ...v, points: v.points.filter((p: string) => p.trim()) }); } finally { setSaving(false); } }}
      className="space-y-4"
    >
      <Field label="Judul"><input className={inputCls} value={v.title} onChange={(e) => setV({ ...v, title: e.target.value })} required /></Field>
      <Field label="Deskripsi"><textarea rows={3} className={inputCls} value={v.description} onChange={(e) => setV({ ...v, description: e.target.value })} required /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Ikon (Lucide)"><input className={inputCls} value={v.icon} onChange={(e) => setV({ ...v, icon: e.target.value })} placeholder="FileText" /></Field>
        <Field label="Urutan"><input type="number" className={inputCls} value={v.order_index} onChange={(e) => setV({ ...v, order_index: Number(e.target.value) })} /></Field>
      </div>
      <Field label="Poin Layanan">
        <div className="space-y-2">
          {v.points.map((p: string, i: number) => (
            <div key={i} className="flex gap-2">
              <input className={inputCls} value={p} onChange={(e) => { const np = [...v.points]; np[i] = e.target.value; setV({ ...v, points: np }); }} />
              <button type="button" onClick={() => setV({ ...v, points: v.points.filter((_: any, j: number) => j !== i) })} className="rounded-lg bg-destructive/10 px-3 text-destructive hover:bg-destructive/20"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
          <button type="button" onClick={() => setV({ ...v, points: [...v.points, ""] })} className="inline-flex items-center gap-1 text-sm font-medium text-primary"><Plus className="h-4 w-4" /> Tambah poin</button>
        </div>
      </Field>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={v.active} onChange={(e) => setV({ ...v, active: e.target.checked })} /> Aktif (tampilkan di situs)</label>
      <button disabled={saving} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[image:var(--gradient-hero)] py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Simpan
      </button>
    </form>
  );
}

function PricingManager({ plans, onChange }: { plans: any[]; onChange: () => void }) {
  const save = useServerFn(upsertPlan);
  const del = useServerFn(deletePlan);
  const [editing, setEditing] = useState<any | null>(null);
  const empty = () => ({ name: "", tag: "", price: "", description: "", features: [""], featured: false, order_index: plans.length + 1, active: true });

  return (
    <div>
      <SectionHead title="Kelola Paket Harga" desc="Atur paket layanan dan harganya.">
        <button onClick={() => setEditing(empty())} className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
          <Plus className="h-4 w-4" /> Paket Baru
        </button>
      </SectionHead>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {plans.map((p) => (
          <div key={p.id} className={`rounded-2xl border p-5 shadow-[var(--shadow-card)] ${p.featured ? "border-primary bg-primary/5" : "border-border bg-card"}`}>
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-primary">{p.tag}</span>
                <h3 className="font-bold">{p.name}</h3>
                <div className="mt-1 text-2xl font-bold">Rp {p.price}</div>
                <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => setEditing(p)} className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-secondary">Edit</button>
                <button onClick={async () => { if (confirm(`Hapus paket "${p.name}"?`)) { await del({ data: { id: p.id } }); onChange(); } }} className="inline-flex items-center gap-1 rounded-lg bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive"><Trash2 className="h-3 w-3" /></button>
              </div>
            </div>
            <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
              {(p.features as string[]).map((f) => <li key={f}>• {f}</li>)}
            </ul>
          </div>
        ))}
      </div>
      {editing && (
        <EditorModal title={editing.id ? "Edit Paket" : "Paket Baru"} onClose={() => setEditing(null)}>
          <PlanForm initial={editing} onSubmit={async (v) => { await save({ data: v }); setEditing(null); onChange(); }} />
        </EditorModal>
      )}
    </div>
  );
}

function PlanForm({ initial, onSubmit }: { initial: any; onSubmit: (v: any) => Promise<void> }) {
  const [v, setV] = useState({ ...initial, features: [...(initial.features ?? [])] });
  const [saving, setSaving] = useState(false);
  return (
    <form onSubmit={async (e) => { e.preventDefault(); setSaving(true); try { await onSubmit({ ...v, features: v.features.filter((f: string) => f.trim()) }); } finally { setSaving(false); } }} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Nama Paket"><input className={inputCls} value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} required /></Field>
        <Field label="Label (mis. Hemat)"><input className={inputCls} value={v.tag} onChange={(e) => setV({ ...v, tag: e.target.value })} /></Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Harga (mis. 300K)"><input className={inputCls} value={v.price} onChange={(e) => setV({ ...v, price: e.target.value })} required /></Field>
        <Field label="Urutan"><input type="number" className={inputCls} value={v.order_index} onChange={(e) => setV({ ...v, order_index: Number(e.target.value) })} /></Field>
      </div>
      <Field label="Deskripsi"><textarea rows={2} className={inputCls} value={v.description} onChange={(e) => setV({ ...v, description: e.target.value })} required /></Field>
      <Field label="Fitur">
        <div className="space-y-2">
          {v.features.map((f: string, i: number) => (
            <div key={i} className="flex gap-2">
              <input className={inputCls} value={f} onChange={(e) => { const nf = [...v.features]; nf[i] = e.target.value; setV({ ...v, features: nf }); }} />
              <button type="button" onClick={() => setV({ ...v, features: v.features.filter((_: any, j: number) => j !== i) })} className="rounded-lg bg-destructive/10 px-3 text-destructive"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
          <button type="button" onClick={() => setV({ ...v, features: [...v.features, ""] })} className="inline-flex items-center gap-1 text-sm font-medium text-primary"><Plus className="h-4 w-4" /> Tambah fitur</button>
        </div>
      </Field>
      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2"><input type="checkbox" checked={v.featured} onChange={(e) => setV({ ...v, featured: e.target.checked })} /> Paket Unggulan</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={v.active} onChange={(e) => setV({ ...v, active: e.target.checked })} /> Aktif</label>
      </div>
      <button disabled={saving} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[image:var(--gradient-hero)] py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Simpan
      </button>
    </form>
  );
}

function SettingsManager({ settings, onChange }: { settings: Record<string, string>; onChange: () => void }) {
  const save = useServerFn(updateSetting);
  const [values, setValues] = useState(settings);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  async function persist(key: string) {
    setSavingKey(key);
    try { await save({ data: { key, value: values[key] ?? "" } }); onChange(); } finally { setSavingKey(null); }
  }

  const fields = [
    { key: "whatsapp_number", label: "Nomor WhatsApp", hint: "Format internasional tanpa +, contoh: 6282186371356" },
    { key: "business_name", label: "Nama Bisnis", hint: "Tampil di header & footer" },
    { key: "hero_badge", label: "Badge Hero", hint: "Teks kecil di atas judul hero" },
  ];

  return (
    <div>
      <SectionHead title="Pengaturan Situs" desc="Ubah informasi global yang tampil di seluruh situs." />
      <div className="mt-6 space-y-4">
        {fields.map((f) => (
          <div key={f.key} className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <Field label={f.label}>
              <input className={inputCls} value={values[f.key] ?? ""} onChange={(e) => setValues({ ...values, [f.key]: e.target.value })} />
            </Field>
            <p className="mt-1 text-xs text-muted-foreground">{f.hint}</p>
            <button
              onClick={() => persist(f.key)}
              disabled={savingKey === f.key}
              className="mt-3 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-60"
            >
              {savingKey === f.key ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Simpan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputCls = "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1 text-xs font-semibold text-muted-foreground">{label}</div>
      {children}
    </label>
  );
}

function SectionHead({ title, desc, children }: { title: string; desc: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
      {children}
    </div>
  );
}

function EditorModal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-card p-6 shadow-[var(--shadow-elegant)]" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold">{title}</h3>
          <button onClick={onClose} className="rounded-full p-1 text-muted-foreground hover:bg-secondary">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}