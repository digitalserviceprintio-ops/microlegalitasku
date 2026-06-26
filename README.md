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
