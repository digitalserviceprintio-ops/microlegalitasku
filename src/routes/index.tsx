import { createFileRoute } from "@tanstack/react-router";
import {
  ShieldCheck,
  FileText,
  Clock,
  Users,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  Sparkles,
  Building2,
  Receipt,
  PhoneCall,
  ClipboardList,
  Send,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Legalin Care — Jasa Pengurusan NIB & NPWP Cepat & Terpercaya" },
      { name: "description", content: "Legalin Care membantu UMKM dan perusahaan mengurus NIB, NPWP, dan legalitas usaha dengan cepat, mudah, dan profesional. Pesan via WhatsApp." },
      { property: "og:title", content: "Legalin Care — Jasa NIB & NPWP" },
      { property: "og:description", content: "Urus NIB & NPWP tanpa ribet. Konsultasi gratis via WhatsApp." },
    ],
  }),
  component: Index,
});

const WA_NUMBER = "6282186371356";
const waLink = (msg: string) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <Services />
      <Why />
      <Process />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
      <FloatingWA />
    </div>
  );
}

function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[image:var(--gradient-hero)] text-primary-foreground shadow-[var(--shadow-elegant)]">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight">Legalin Care</span>
        </a>
        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          <a href="#layanan" className="transition hover:text-foreground">Layanan</a>
          <a href="#keunggulan" className="transition hover:text-foreground">Keunggulan</a>
          <a href="#proses" className="transition hover:text-foreground">Proses</a>
          <a href="#harga" className="transition hover:text-foreground">Harga</a>
          <a href="#faq" className="transition hover:text-foreground">FAQ</a>
        </nav>
        <a
          href={waLink("Halo Legalin Care, saya ingin konsultasi pengurusan NIB/NPWP.")}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-[color:var(--whatsapp)] px-4 py-2 text-sm font-semibold text-[color:var(--whatsapp-foreground)] shadow-[var(--shadow-card)] transition hover:opacity-90"
        >
          <MessageCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Konsultasi Gratis</span>
          <span className="sm:hidden">Chat</span>
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10 opacity-60"
        style={{ background: "var(--gradient-soft)" }}
      />
      <div className="absolute -right-32 -top-32 -z-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 -z-10 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />

      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2 md:py-28 md:items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-[var(--shadow-card)]">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Terpercaya untuk 1.000+ UMKM di Indonesia
          </span>
          <h1 className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
            Urus <span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">NIB & NPWP</span> tanpa ribet, tanpa antri.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
            Legalin Care membantu Anda mengurus legalitas usaha secara online — cepat, transparan, dan didampingi konsultan berpengalaman. Cukup chat WhatsApp, kami yang urus.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={waLink("Halo Legalin Care, saya ingin memulai pengurusan NIB/NPWP.")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[color:var(--whatsapp)] px-6 py-3 text-sm font-semibold text-[color:var(--whatsapp-foreground)] shadow-[var(--shadow-elegant)] transition hover:scale-[1.02]"
            >
              <MessageCircle className="h-4 w-4" />
              Pesan via WhatsApp
            </a>
            <a
              href="#layanan"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-secondary"
            >
              Lihat Layanan
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4 border-t border-border pt-6">
            {[
              { v: "1.000+", l: "Klien Terlayani" },
              { v: "3 Hari", l: "Estimasi Tercepat" },
              { v: "100%", l: "Legal & Resmi" },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-2xl font-bold tracking-tight text-foreground">{s.v}</div>
                <div className="mt-1 text-xs text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 -z-10 rounded-3xl bg-[image:var(--gradient-hero)] opacity-20 blur-2xl" />
          <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-elegant)]">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--whatsapp)] text-[color:var(--whatsapp-foreground)]">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Legalin Care</div>
                  <div className="text-xs text-[color:var(--whatsapp)]">● Online sekarang</div>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">WhatsApp</span>
            </div>
            <div className="mt-4 space-y-3 text-sm">
              <ChatBubble side="left">Halo, selamat datang di Legalin Care 👋 Ada yang bisa kami bantu?</ChatBubble>
              <ChatBubble side="right">Saya mau urus NIB & NPWP untuk UMKM saya.</ChatBubble>
              <ChatBubble side="left">Siap! Prosesnya cepat, mulai dari <b>Rp 150.000</b> dan selesai dalam 3 hari kerja ✅</ChatBubble>
              <ChatBubble side="right">Boleh dibantu sekarang?</ChatBubble>
            </div>
            <a
              href={waLink("Halo, saya ingin lanjut pengurusan NIB/NPWP.")}
              target="_blank"
              rel="noreferrer"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[color:var(--whatsapp)] py-3 text-sm font-semibold text-[color:var(--whatsapp-foreground)] transition hover:opacity-90"
            >
              <Send className="h-4 w-4" /> Lanjut Chat
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function ChatBubble({ side, children }: { side: "left" | "right"; children: React.ReactNode }) {
  const isLeft = side === "left";
  return (
    <div className={`flex ${isLeft ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-snug ${
          isLeft
            ? "rounded-tl-sm bg-secondary text-secondary-foreground"
            : "rounded-tr-sm bg-[color:var(--whatsapp)] text-[color:var(--whatsapp-foreground)]"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function Services() {
  const items = [
    {
      icon: Building2,
      title: "Pengurusan NIB (OSS RBA)",
      desc: "Nomor Induk Berusaha resmi untuk UMKM, PT, dan CV. Termasuk klasifikasi KBLI yang tepat.",
      points: ["Verifikasi data usaha", "Pendaftaran OSS", "NIB resmi terbit"],
    },
    {
      icon: Receipt,
      title: "Pengurusan NPWP",
      desc: "NPWP pribadi maupun badan usaha. Cocok untuk syarat tender, perbankan, dan perpajakan.",
      points: ["NPWP Pribadi", "NPWP Badan / UMKM", "Aktivasi EFIN"],
    },
    {
      icon: FileText,
      title: "Legalitas Usaha Lainnya",
      desc: "Pendirian PT/CV, izin usaha, sertifikat standar, hingga konsultasi pajak bulanan.",
      points: ["Pendirian PT / CV", "Izin Usaha & Sertifikat", "Konsultasi Pajak"],
    },
  ];
  return (
    <section id="layanan" className="mx-auto max-w-6xl px-6 py-20">
      <SectionHeader
        eyebrow="Layanan Kami"
        title="Solusi legalitas lengkap untuk usaha Anda"
        desc="Fokus jalankan bisnis, biarkan urusan legalitas kami yang tangani."
      />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {items.map((it) => (
          <div
            key={it.title}
            className="group rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
              <it.icon className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-lg font-semibold">{it.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{it.desc}</p>
            <ul className="mt-4 space-y-2">
              {it.points.map((p) => (
                <li key={p} className="flex items-center gap-2 text-sm text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-[color:var(--accent)]" />
                  {p}
                </li>
              ))}
            </ul>
            <a
              href={waLink(`Halo, saya tertarik dengan layanan: ${it.title}`)}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary transition hover:gap-2"
            >
              Pesan Sekarang <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

function Why() {
  const items = [
    { icon: Clock, title: "Proses Cepat", desc: "Selesai mulai 3 hari kerja, tanpa drama birokrasi." },
    { icon: ShieldCheck, title: "Resmi & Legal", desc: "Diterbitkan langsung oleh sistem pemerintah." },
    { icon: Users, title: "Konsultan Berpengalaman", desc: "Didampingi tim ahli legal & perpajakan." },
    { icon: Sparkles, title: "Harga Transparan", desc: "Tanpa biaya tersembunyi, jelas di awal." },
  ];
  return (
    <section id="keunggulan" className="bg-secondary/40 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          eyebrow="Mengapa Legalin Care"
          title="Dipercaya pelaku usaha di seluruh Indonesia"
          desc="Kami menggabungkan kecepatan, transparansi, dan keramahan layanan."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <div key={it.title} className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[image:var(--gradient-hero)] text-primary-foreground">
                <it.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{it.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process() {
  const steps = [
    { icon: PhoneCall, title: "Konsultasi via WhatsApp", desc: "Hubungi kami, ceritakan kebutuhan legalitas usaha Anda." },
    { icon: ClipboardList, title: "Kirim Dokumen", desc: "Cukup KTP & data usaha. Tim kami yang menyiapkan sisanya." },
    { icon: FileText, title: "Proses Pengurusan", desc: "Kami daftarkan ke OSS / DJP dan pantau prosesnya untuk Anda." },
    { icon: CheckCircle2, title: "Dokumen Diterima", desc: "NIB / NPWP dikirim dalam bentuk soft & hard copy." },
  ];
  return (
    <section id="proses" className="mx-auto max-w-6xl px-6 py-20">
      <SectionHeader
        eyebrow="Cara Kerja"
        title="4 langkah mudah, semua online"
        desc="Tidak perlu datang ke kantor. Cukup duduk, kami yang urus."
      />
      <div className="mt-12 grid gap-6 md:grid-cols-4">
        {steps.map((s, i) => (
          <div key={s.title} className="relative rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <div className="absolute -top-3 left-6 rounded-full bg-[image:var(--gradient-hero)] px-3 py-1 text-xs font-bold text-primary-foreground">
              Langkah {i + 1}
            </div>
            <s.icon className="mt-3 h-7 w-7 text-primary" />
            <h3 className="mt-3 font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Pricing() {
  const plans = [
    {
      name: "NPWP",
      price: "150K",
      tag: "Mulai dari",
      desc: "Cocok untuk pribadi & freelancer.",
      features: ["NPWP Pribadi / Badan", "Aktivasi EFIN", "Konsultasi gratis", "Selesai 2-3 hari"],
      featured: false,
    },
    {
      name: "NIB UMKM",
      price: "300K",
      tag: "Paling Populer",
      desc: "Untuk usaha mikro & kecil.",
      features: ["NIB OSS RBA resmi", "Pemilihan KBLI tepat", "Sertifikat Standar (jika perlu)", "Selesai 3-5 hari"],
      featured: true,
    },
    {
      name: "Paket Lengkap",
      price: "750K",
      tag: "Hemat",
      desc: "NIB + NPWP Badan sekaligus.",
      features: ["NIB OSS RBA", "NPWP Badan", "Konsultasi pajak 1 bulan", "Prioritas pengerjaan"],
      featured: false,
    },
  ];
  return (
    <section id="harga" className="bg-secondary/40 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          eyebrow="Harga"
          title="Transparan, tanpa biaya tersembunyi"
          desc="Pilih paket sesuai kebutuhan. Bisa request custom via WhatsApp."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative rounded-3xl border p-7 shadow-[var(--shadow-card)] transition hover:-translate-y-1 ${
                p.featured
                  ? "border-transparent bg-[image:var(--gradient-hero)] text-primary-foreground shadow-[var(--shadow-elegant)]"
                  : "border-border bg-card"
              }`}
            >
              <div className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                p.featured ? "bg-white/20 text-primary-foreground" : "bg-primary/10 text-primary"
              }`}>
                {p.tag}
              </div>
              <h3 className="mt-4 text-xl font-bold">{p.name}</h3>
              <p className={`mt-1 text-sm ${p.featured ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                {p.desc}
              </p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-sm opacity-80">Rp</span>
                <span className="text-4xl font-bold tracking-tight">{p.price}</span>
              </div>
              <ul className="mt-6 space-y-2.5 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${p.featured ? "text-white" : "text-[color:var(--accent)]"}`} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href={waLink(`Halo, saya tertarik dengan paket ${p.name}.`)}
                target="_blank"
                rel="noreferrer"
                className={`mt-7 flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold transition ${
                  p.featured
                    ? "bg-white text-primary hover:bg-white/90"
                    : "bg-[color:var(--whatsapp)] text-[color:var(--whatsapp-foreground)] hover:opacity-90"
                }`}
              >
                <MessageCircle className="h-4 w-4" /> Pesan via WhatsApp
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    { q: "Apakah dokumen yang diurus 100% resmi?", a: "Ya. Semua dokumen diterbitkan langsung oleh sistem pemerintah (OSS / DJP) dan dapat dicek keasliannya." },
    { q: "Berapa lama prosesnya?", a: "NPWP rata-rata 2–3 hari kerja, NIB 3–5 hari kerja, tergantung kelengkapan dokumen." },
    { q: "Dokumen apa saja yang perlu disiapkan?", a: "Untuk perorangan cukup KTP & data usaha. Untuk badan usaha, kami bantu siapkan dari nol." },
    { q: "Apakah bisa pesan dari luar kota?", a: "Bisa. Proses 100% online, dokumen kami kirim via email & ekspedisi." },
  ];
  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-20">
      <SectionHeader
        eyebrow="FAQ"
        title="Pertanyaan yang sering diajukan"
        desc="Belum menemukan jawabannya? Chat tim kami langsung."
      />
      <div className="mt-10 space-y-3">
        {faqs.map((f) => (
          <details
            key={f.q}
            className="group rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] transition open:shadow-[var(--shadow-elegant)]"
          >
            <summary className="flex cursor-pointer items-center justify-between gap-4 text-sm font-semibold marker:hidden">
              {f.q}
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-20">
      <div className="relative overflow-hidden rounded-3xl bg-[image:var(--gradient-hero)] p-10 text-center shadow-[var(--shadow-elegant)] md:p-16">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <h2 className="relative text-3xl font-bold text-primary-foreground md:text-4xl">
          Siap legalkan usaha Anda hari ini?
        </h2>
        <p className="relative mx-auto mt-3 max-w-xl text-primary-foreground/85">
          Konsultasi gratis. Tim kami siap menjawab semua pertanyaan Anda via WhatsApp.
        </p>
        <a
          href={waLink("Halo Legalin Care, saya ingin konsultasi gratis.")}
          target="_blank"
          rel="noreferrer"
          className="relative mt-7 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-primary transition hover:scale-[1.02]"
        >
          <MessageCircle className="h-4 w-4" /> Mulai Konsultasi Gratis
        </a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 md:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[image:var(--gradient-hero)] text-primary-foreground">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold">Legalin Care</span>
        </div>
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Legalin Care. Semua hak dilindungi.</p>
      </div>
    </footer>
  );
}

function FloatingWA() {
  return (
    <a
      href={waLink("Halo Legalin Care, saya ingin bertanya.")}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--whatsapp)] text-[color:var(--whatsapp-foreground)] shadow-[var(--shadow-elegant)] transition hover:scale-110"
    >
      <MessageCircle className="h-6 w-6" />
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--whatsapp)] opacity-30" />
    </a>
  );
}

function SectionHeader({ eyebrow, title, desc }: { eyebrow: string; title: string; desc: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
        {eyebrow}
      </span>
      <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>
      <p className="mt-3 text-base text-muted-foreground">{desc}</p>
    </div>
  );
}
