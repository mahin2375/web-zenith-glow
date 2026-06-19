import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight, ShoppingBag, Globe, Zap, TrendingUp, Layers, Gauge, Search,
  Settings, PenTool, Code, Star, ChevronDown, Sparkles, Play, Facebook, Instagram, Linkedin,
} from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import heroImg from "@/assets/hero-greenhouse.jpg";
import { useProjects, useTeam, useTestimonials, useVideos } from "@/lib/cms";
import { seedProjects, seedTeam, seedTestimonials, seedVideos } from "@/lib/seed-content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Creative Web Boost — Premium WordPress & Shopify Development" },
      { name: "description", content: "Award-winning WordPress and Shopify development agency. Conversion-first design, lightning-fast performance, and a free 5-product Shopify store offer." },
      { property: "og:title", content: "Creative Web Boost — Premium WordPress & Shopify Development" },
      { property: "og:description", content: "Premium agency for WordPress & Shopify ecosystems. Book a free meeting." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: HomePage,
});

const services = [
  { icon: ShoppingBag, title: "Shopify Plus Mastery", desc: "Enterprise commerce with custom Liquid and headless architecture.", featured: true },
  { icon: Globe, title: "WordPress & Headless", desc: "Editorial CMS or Next.js front-ends for instant performance." },
  { icon: Layers, title: "WooCommerce", desc: "Scalable WooCommerce stores with custom checkout flows." },
  { icon: PenTool, title: "Landing Pages", desc: "Conversion-first pages launched in days, not weeks." },
  { icon: Code, title: "Custom Development", desc: "Apps, integrations, and bespoke functionality." },
  { icon: TrendingUp, title: "Website Redesign", desc: "Modern rebuilds that lift conversion and brand." },
  { icon: Gauge, title: "Speed Optimization", desc: "99+ Lighthouse scores and Core Web Vitals fixes." },
  { icon: Search, title: "SEO Setup", desc: "Technical SEO foundations and content strategy." },
  { icon: Settings, title: "Maintenance", desc: "Monthly care plans, monitoring, and updates." },
  { icon: Zap, title: "Conversion Audit", desc: "Heatmaps, A/B tests, and a roadmap to grow revenue." },
];

const faqs = [
  { q: "What is your typical project timeline?", a: "Most landing pages launch in 2 weeks. Standard Shopify or WordPress builds run 4–8 weeks. Enterprise migrations 8–16 weeks." },
  { q: "How does the free 5-product Shopify store work?", a: "We design and develop a clean, conversion-ready store with up to 5 products, theme setup, and payment gateway, no strings attached. Limited spots monthly." },
  { q: "Do you provide ongoing maintenance?", a: "Yes — monthly care plans include hosting checks, security, performance monitoring, and a block of development hours." },
  { q: "Can you migrate my existing site?", a: "Absolutely. We handle WordPress ↔ Shopify migrations and Shopify Basic → Plus upgrades with zero downtime." },
  { q: "Do you build outside Shopify and WordPress?", a: "Our focus is these two ecosystems where we deliver the best results. For other stacks, we'll recommend a trusted partner." },
];

function HomePage() {
  return (
    <SiteShell>
      <Hero />
      <Counters />
      <Services />
      <FreeOffer />
      <Portfolio />
      <Team />
      <YouTube />
      <Testimonials />
      <FAQ />
      <ContactCTA />
    </SiteShell>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-mesh">
      <div className="pointer-events-none absolute -top-32 -right-20 size-[28rem] rounded-full bg-primary/15 blur-3xl float-blob" />
      <div className="pointer-events-none absolute -bottom-32 -left-20 size-[28rem] rounded-full bg-primary-glow/20 blur-3xl float-blob" style={{ animationDelay: "-4s" }} />
      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 py-24 lg:grid-cols-[1.15fr_0.85fr] lg:py-32">
        <div className="reveal">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/60" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            Now accepting Q1 2026 projects
          </div>
          <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            Grow Your Business with Powerful{" "}
            <span className="gradient-text">WordPress &amp; Shopify</span> Solutions
          </h1>
          <p className="mt-8 max-w-[52ch] text-pretty text-lg leading-relaxed text-muted-foreground">
            We design and engineer premium digital ecosystems for ambitious brands. Conversion-first, lightning-fast, and built to scale.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to="/contact"
              hash="book"
              className="magnetic-btn inline-flex items-center gap-2 rounded-2xl bg-primary px-7 py-4 text-base font-semibold text-primary-foreground shadow-glow ring-1 ring-primary/20 hover:bg-primary/90"
            >
              Book Free Meeting <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/portfolio"
              className="magnetic-btn inline-flex items-center gap-2 rounded-2xl border border-foreground/10 bg-card px-7 py-4 text-base font-semibold text-foreground hover:border-primary/40"
            >
              View Portfolio
            </Link>
          </div>
        </div>
        <div className="relative">
          <div className="overflow-hidden rounded-[2rem] shadow-soft ring-1 ring-foreground/5">
            <img
              src={heroImg}
              alt="Lush modern greenhouse — Creative Web Boost"
              width={1280}
              height={1600}
              className="aspect-[4/5] w-full object-cover"
              fetchPriority="high"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 hidden max-w-[260px] rounded-2xl glass-card p-5 shadow-glow xl:block">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Latest win</p>
            <p className="mt-2 text-sm leading-relaxed text-foreground/80">
              +42% conversion lift for Leaf &amp; Soil within 90 days of launch.
            </p>
          </div>
          <div className="absolute -top-4 -right-4 hidden rounded-2xl glass-card p-4 shadow-glow xl:flex xl:items-center xl:gap-3">
            <Sparkles className="size-5 text-primary" />
            <span className="text-sm font-semibold">99+ Lighthouse</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Counters() {
  const stats = [
    { v: "400+", l: "Sites Launched" },
    { v: "$40M+", l: "Client Revenue" },
    { v: "32", l: "Countries Served" },
    { v: "4.9 / 5", l: "Client Rating" },
  ];
  return (
    <section className="border-y border-foreground/5 bg-card">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-12 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.l}>
            <div className="text-3xl font-semibold tracking-tight md:text-4xl">{s.v}</div>
            <div className="mt-1 text-sm text-muted-foreground">{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">Services</p>
            <h2 className="max-w-2xl text-balance text-3xl font-semibold md:text-4xl">
              Comprehensive growth services for modern brands
            </h2>
          </div>
          <p className="max-w-md text-pretty text-muted-foreground">
            From bespoke Shopify builds to complex WordPress integrations — we handle the technical soil so you can grow.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:grid-rows-2">
          {/* Featured */}
          <div className="md:col-span-2 md:row-span-2 rounded-3xl p-px animated-border">
            <div className="flex h-full flex-col justify-between rounded-[calc(theme(borderRadius.3xl)-1px)] bg-card p-8">
              <div>
                <div className="mb-6 grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
                  <ShoppingBag className="size-6" />
                </div>
                <h3 className="text-2xl font-semibold">Shopify Plus Mastery</h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                  Enterprise-grade commerce with custom Liquid, headless architecture, and bespoke checkout flows that turn browsers into buyers.
                </p>
              </div>
              <ul className="mt-8 flex flex-wrap gap-2">
                {["Liquid", "Hydrogen", "Plus", "Headless"].map((t) => (
                  <li key={t} className="rounded-full bg-mint px-3 py-1 text-xs font-medium text-leaf-dark">{t}</li>
                ))}
              </ul>
            </div>
          </div>

          {services.slice(1, 7).map((s) => (
            <div
              key={s.title}
              className="group rounded-3xl border border-foreground/5 bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-glow"
            >
              <div className="mb-4 grid size-10 place-items-center rounded-lg bg-mint text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <s.icon className="size-5" />
              </div>
              <h4 className="font-semibold">{s.title}</h4>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          {services.slice(7).map((s) => (
            <div key={s.title} className="rounded-3xl border border-foreground/5 bg-card p-6 hover:border-primary/30">
              <div className="mb-4 grid size-10 place-items-center rounded-lg bg-mint text-primary">
                <s.icon className="size-5" />
              </div>
              <h4 className="font-semibold">{s.title}</h4>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FreeOffer() {
  return (
    <section className="px-6 py-12">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-leaf-dark p-12 text-white md:p-16">
        <div className="pointer-events-none absolute -right-20 top-0 size-96 rounded-full bg-primary/30 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 -left-20 size-72 rounded-full bg-primary-glow/20 blur-3xl" />
        <div className="relative grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="size-3.5" /> Limited offer
            </div>
            <h2 className="mt-5 text-balance text-3xl font-semibold leading-tight md:text-4xl">
              We Build Your First 5-Product Shopify Store{" "}
              <span className="text-primary-glow">FREE</span>
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70">
              Starting out? Get a professional store setup with theme configuration, 5 products, and payment gateway — on us. No strings, just a head start.
            </p>
            <Link
              to="/contact"
              hash="offer"
              className="magnetic-btn mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-4 text-base font-semibold text-leaf-dark hover:bg-mint"
            >
              Claim Your Free Store <ArrowRight className="size-4" />
            </Link>
          </div>
          <ul className="space-y-3 text-sm">
            {[
              "Custom theme configuration",
              "5 conversion-ready product pages",
              "Payment gateway setup",
              "Mobile optimization",
              "Launch support",
            ].map((f) => (
              <li key={f} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <span className="grid size-6 place-items-center rounded-full bg-primary text-primary-foreground">✓</span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Portfolio() {
  const [filter, setFilter] = useState<string>("All");
  const { data } = useProjects();
  const items = (data && data.length > 0 ? data : seedProjects).filter(
    (p) => filter === "All" || p.category === filter,
  );
  const filters = ["All", "Shopify", "WordPress", "Landing Page"];

  return (
    <section id="portfolio" className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">Selected work</p>
            <h2 className="text-balance text-3xl font-semibold md:text-4xl">Portfolio highlights</h2>
            <p className="mt-3 text-muted-foreground">Real brands. Real revenue. Real stories.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  filter === f
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {items.slice(0, 4).map((p) => (
            <Link
              to="/portfolio"
              key={p.id}
              className="group block"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-mint ring-1 ring-foreground/5">
                {p.cover_image && (
                  <img
                    src={p.cover_image}
                    alt={p.title}
                    width={1280}
                    height={960}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-leaf-dark/40 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <div className="mt-5 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">{p.category}</p>
                  <h3 className="mt-1 text-xl font-semibold">{p.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
                </div>
                <ArrowRight className="size-5 shrink-0 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/portfolio"
            className="magnetic-btn inline-flex items-center gap-2 rounded-2xl border border-foreground/10 bg-card px-6 py-3 text-sm font-semibold hover:border-primary/40"
          >
            View All Projects <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Team() {
  const { data } = useTeam();
  const items = data && data.length > 0 ? data : seedTeam;

  return (
    <section className="bg-mint/40 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">The team</p>
          <h2 className="text-balance text-3xl font-semibold md:text-4xl">The cultivators behind your growth</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((m) => (
            <div
              key={m.id}
              className="group rounded-3xl border border-foreground/5 bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-glow"
            >
              <div className="overflow-hidden rounded-2xl bg-mint">
                {m.photo && (
                  <img
                    src={m.photo}
                    alt={m.name}
                    width={512}
                    height={512}
                    loading="lazy"
                    className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </div>
              <h4 className="mt-5 text-lg font-semibold">{m.name}</h4>
              <p className="text-sm text-muted-foreground">{m.role}</p>
              {m.bio && <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{m.bio}</p>}
              <div className="mt-4 flex gap-2">
                {m.facebook_url && (
                  <a href={m.facebook_url} aria-label={`${m.name} on Facebook`} className="grid size-8 place-items-center rounded-lg bg-mint text-muted-foreground hover:bg-primary hover:text-primary-foreground">
                    <Facebook className="size-3.5" />
                  </a>
                )}
                {m.instagram_url && (
                  <a href={m.instagram_url} aria-label={`${m.name} on Instagram`} className="grid size-8 place-items-center rounded-lg bg-mint text-muted-foreground hover:bg-primary hover:text-primary-foreground">
                    <Instagram className="size-3.5" />
                  </a>
                )}
                {m.linkedin_url && (
                  <a href={m.linkedin_url} aria-label={`${m.name} on LinkedIn`} className="grid size-8 place-items-center rounded-lg bg-mint text-muted-foreground hover:bg-primary hover:text-primary-foreground">
                    <Linkedin className="size-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function YouTube() {
  const { data } = useVideos();
  const items = data && data.length > 0 ? data : seedVideos;
  return (
    <section className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">YouTube</p>
            <h2 className="text-balance text-3xl font-semibold md:text-4xl">Learn from our studio</h2>
            <p className="mt-3 text-muted-foreground">Weekly insights on Shopify, WordPress, and conversion design.</p>
          </div>
          <a
            href="https://youtube.com/@creativewebboost"
            target="_blank"
            rel="noreferrer"
            className="magnetic-btn inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Watch on YouTube <ArrowRight className="size-4" />
          </a>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.slice(0, 3).map((v) => (
            <a
              key={v.id}
              href={v.youtube_url}
              target="_blank"
              rel="noreferrer"
              className="group block overflow-hidden rounded-3xl border border-foreground/5 bg-card transition-all hover:-translate-y-1 hover:shadow-glow"
            >
              <div className="relative aspect-video overflow-hidden bg-mint">
                {v.thumbnail && (
                  <img src={v.thumbnail} alt={v.title} width={1280} height={720} loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
                )}
                <div className="absolute inset-0 grid place-items-center bg-leaf-dark/30 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="grid size-14 place-items-center rounded-full bg-white text-leaf-dark shadow-glow">
                    <Play className="size-6 fill-current" />
                  </span>
                </div>
              </div>
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">{v.category}</p>
                <h4 className="mt-2 font-semibold">{v.title}</h4>
                <p className="mt-1 text-xs text-muted-foreground">{v.channel_name}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const { data } = useTestimonials();
  const items = data && data.length > 0 ? data : seedTestimonials;
  return (
    <section className="bg-mint/40 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">Testimonials</p>
          <h2 className="text-balance text-3xl font-semibold md:text-4xl">Trusted by ambitious teams</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.slice(0, 3).map((t) => (
            <div key={t.id} className="rounded-3xl bg-card p-8 shadow-soft ring-1 ring-foreground/5">
              <div className="mb-4 flex gap-1 text-primary">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </div>
              <p className="text-foreground/80 italic leading-relaxed">&ldquo;{t.content}&rdquo;</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {t.client_name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.client_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.client_role}{t.company ? `, ${t.company}` : ""}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="bg-background py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">FAQ</p>
          <h2 className="text-balance text-3xl font-semibold md:text-4xl">Frequently asked questions</h2>
        </div>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <button
              key={f.q}
              onClick={() => setOpen(open === i ? null : i)}
              className="block w-full overflow-hidden rounded-2xl border border-foreground/5 bg-card text-left transition-colors hover:border-primary/30"
            >
              <div className="flex items-center justify-between px-6 py-5">
                <span className="font-semibold">{f.q}</span>
                <ChevronDown className={`size-4 shrink-0 text-primary transition-transform ${open === i ? "rotate-180" : ""}`} />
              </div>
              <div className={`grid transition-all ${open === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden">
                  <p className="px-6 pb-6 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactCTA() {
  return (
    <section className="bg-background pb-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="rounded-[2rem] bg-mesh border border-foreground/5 p-12 text-center md:p-20">
          <h2 className="mx-auto max-w-3xl text-balance text-3xl font-semibold md:text-5xl">
            Ready to start your next <span className="gradient-text">growth cycle?</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-muted-foreground">
            Book a free 15-minute discovery call. We&rsquo;ll map the fastest path from your current site to your next milestone.
          </p>
          <Link
            to="/contact"
            hash="book"
            className="magnetic-btn mt-8 inline-flex items-center gap-2 rounded-2xl bg-primary px-7 py-4 text-base font-semibold text-primary-foreground shadow-glow"
          >
            Book Free Meeting <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
