# Legalin Care

Landing page agen jasa pengurusan **NIB & NPWP** dengan dashboard admin
(kelola layanan, harga, dan pengaturan situs) serta integrasi pemesanan
via WhatsApp.

Stack: TanStack Start v1 (React 19 + Vite 7) · Tailwind CSS v4 ·
Lovable Cloud (Supabase) · Nitro preset Cloudflare Workers.

---

## Pengembangan Lokal

```bash
bun install
bun run dev      # http://localhost:8080
bun run build    # build produksi (output ke .output/)
```

Variabel `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, dan
`VITE_SUPABASE_PROJECT_ID` sudah ada di `.env` (auto-managed oleh
Lovable Cloud — jangan diedit manual).

---

## Deploy ke Cloudflare Workers

TanStack Start + Nitro (preset Cloudflare) meng-generate worker bundle
dan static assets ke folder `dist/` saat `vite build`:

- `dist/server/index.mjs` — worker entry
- `dist/server/wrangler.json` — config wrangler yang **otomatis di-generate**
  Nitro (jangan dibuat manual di root — akan di-override dan memunculkan
  warning `Wrangler config main is overridden`)
- `dist/client/` — static assets (binding `ASSETS`)

Karena `wrangler.json` ada di `dist/server/`, deploy harus menunjuk ke
config tersebut secara eksplisit.

### 1. Pengaturan Build di Cloudflare Dashboard

Buka **Workers & Pages → (project kamu) → Settings → Builds** dan isi:

| Field | Nilai |
| --- | --- |
| **Root directory** | `/` |
| **Build command** | `bun install && bun run build` |
| **Deploy command** | `npx wrangler deploy --config dist/server/wrangler.json` |
| **Branch** | `main` (atau branch produksi kamu) |

> ⚠️ Kalau **Build command** dibiarkan `None`, `dist/` tidak pernah
> dibuat dan `wrangler deploy` akan gagal dengan error
> `Missing entry-point` / build error ±20–30 detik. Ini penyebab
> deployment yang sebelumnya gagal.

### 2. Environment Variables di Cloudflare

Di **Settings → Variables and Secrets**, tambahkan variabel yang sama
seperti di `.env` lokal (tipe **Plaintext** untuk yang `VITE_*`,
**Secret** untuk kunci sensitif):

| Nama | Tipe | Keterangan |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Plaintext | URL project Lovable Cloud |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Plaintext | Anon/publishable key |
| `VITE_SUPABASE_PROJECT_ID` | Plaintext | Project ref |

Variabel `VITE_*` dibaca **saat build** (di-inline ke bundle client),
jadi wajib tersedia sebelum `bun run build` jalan. Variabel server-only
(mis. webhook secret) cukup di-set sebagai **Secret** dan dibaca lewat
`process.env.X` di dalam `.handler()` server function.

### 3. Compatibility Settings

Sudah ditetapkan otomatis di `dist/server/wrangler.json` oleh Nitro dan
tidak perlu diubah di dashboard:

- `compatibility_date`: `2025-06-01`
- `compatibility_flags`: `["nodejs_compat"]`

### 4. Deploy Manual (opsional, dari lokal)

```bash
bun install
bun run build
npx wrangler login          # sekali saja
npx wrangler deploy --config dist/server/wrangler.json
```

### 5. Verifikasi Setelah Deploy

- Cek log build di Cloudflare — pastikan ada baris `vite build` sukses
  dan `dist/server/index.mjs` ter-upload.
- Buka URL worker → landing page harus tampil, drawer mobile jalan,
  dan tombol WhatsApp mengarah ke `wa.me/6282186371356`.
- Login admin di `/auth` masih bekerja (Supabase auth via publishable key).

---

## Deploy ke Vercel

Nitro (preset auto-detect) mengenali environment Vercel lewat variabel
`VERCEL=1` yang di-set otomatis oleh Vercel CI, lalu menghasilkan output
Build Output API v3 di folder `.vercel/output/`. File `vercel.json` di
root sudah mengunci build & install command supaya Vercel tidak salah
menebak framework.

### 1. Import Project

Vercel Dashboard → **Add New → Project** → pilih repo GitHub kamu.
Framework Preset: **Other** (biarkan `vercel.json` yang mengatur).

### 2. Environment Variables

Di **Settings → Environment Variables**, tambahkan (scope: Production +
Preview + Development):

| Nama | Nilai |
| --- | --- |
| `VITE_SUPABASE_URL` | sama seperti `.env` lokal |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | sama seperti `.env` lokal |
| `VITE_SUPABASE_PROJECT_ID` | sama seperti `.env` lokal |
| `NITRO_PRESET` | `vercel` *(opsional, fallback)* |

Variabel `VITE_*` dibaca **saat build** (di-inline ke bundle client),
jadi wajib tersedia sebelum `bun run build` jalan.

### 3. Deploy

Push ke branch produksi → Vercel otomatis:

```bash
bun install          # installCommand
bun run build        # buildCommand → menghasilkan .vercel/output/
```

Vercel membaca `.vercel/output/config.json` (dibuat Nitro) dan
men-deploy sebagai Serverless/Edge Function + static assets. Tidak perlu
`vercel deploy` manual.

### 4. Troubleshooting Vercel

| Gejala | Penyebab | Solusi |
| --- | --- | --- |
| Build sukses tapi halaman 404 | Preset Nitro tidak ke-detect | Set env `NITRO_PRESET=vercel` di Vercel dashboard, lalu re-deploy |
| Halaman blank / `VITE_SUPABASE_URL undefined` | Env `VITE_*` belum di-set | Tambahkan di Environment Variables → re-deploy |
| `[unenv] X is not implemented` | Modul Node yang tidak didukung Serverless/Edge | Ganti dengan API web standar / fetch |
| Deploy pakai preset Cloudflare (ada `dist/server/wrangler.json`) | `VERCEL` env tidak terbaca | Pastikan build jalan di Vercel CI (bukan lokal) dan `NITRO_PRESET=vercel` di-set |

---

## Alternatif: Publish via Lovable

Tombol **Publish** di editor Lovable melakukan build + deploy otomatis
ke `https://legalincare.lovable.app` tanpa setup Cloudflare manual.
Custom domain bisa disambungkan di **Project Settings → Domains**.

---

## Troubleshooting Deploy

| Gejala | Penyebab | Solusi |
| --- | --- | --- |
| Build gagal ±20 dtk, log kosong | Build command `None` | Set ke `bun install && bun run build` |
| `Missing entry-point` saat deploy | `dist/` belum dibuat atau config wrangler salah | Pastikan build jalan & pakai `--config dist/server/wrangler.json` |
| Halaman blank, error `VITE_SUPABASE_URL undefined` | Env `VITE_*` belum di-set di Cloudflare | Tambahkan di Variables and Secrets, lalu re-deploy |
| `[unenv] X is not implemented` | Pakai modul Node yang tidak didukung Workers | Ganti dengan API web standar / fetch |
| `Wrangler config main is overridden` warning | Ada `wrangler.jsonc` manual di root | Hapus — Nitro otomatis generate `dist/server/wrangler.json` |
| 404 saat refresh route dalam | Pakai config wrangler yang salah | Gunakan `dist/server/wrangler.json` yang di-generate Nitro |
