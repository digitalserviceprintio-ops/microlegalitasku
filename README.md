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
dan static assets ke folder `.output/` saat `vite build`. File
[`wrangler.jsonc`](./wrangler.jsonc) di root sudah menunjuk ke output
tersebut, jadi `wrangler deploy` cukup dijalankan setelah build.

### 1. Pengaturan Build di Cloudflare Dashboard

Buka **Workers & Pages → (project kamu) → Settings → Builds** dan isi:

| Field | Nilai |
| --- | --- |
| **Root directory** | `/` |
| **Build command** | `bun install && bun run build` |
| **Deploy command** | `npx wrangler deploy` |
| **Branch** | `main` (atau branch produksi kamu) |

> ⚠️ Kalau **Build command** dibiarkan `None`, `.output/` tidak pernah
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

Sudah ditetapkan di `wrangler.jsonc` dan tidak perlu diubah di dashboard:

- `compatibility_date`: `2025-06-01`
- `compatibility_flags`: `["nodejs_compat"]`

### 4. Deploy Manual (opsional, dari lokal)

```bash
bun install
bun run build
npx wrangler login          # sekali saja
npx wrangler deploy
```

### 5. Verifikasi Setelah Deploy

- Cek log build di Cloudflare — pastikan ada baris `vite build` sukses
  dan `.output/server/index.mjs` ter-upload.
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
| `Missing entry-point` saat deploy | `.output/` belum dibuat | Pastikan build jalan sebelum `wrangler deploy` |
| Halaman blank, error `VITE_SUPABASE_URL undefined` | Env `VITE_*` belum di-set di Cloudflare | Tambahkan di Variables and Secrets, lalu re-deploy |
| `[unenv] X is not implemented` | Pakai modul Node yang tidak didukung Workers | Ganti dengan API web standar / fetch |
| 404 saat refresh route dalam | `assets.directory` salah | Pastikan `wrangler.jsonc` menunjuk `.output/public` |
