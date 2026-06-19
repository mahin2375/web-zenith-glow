import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";
import { ArrowRight, Check, ShoppingBag, Globe, Gauge, Search, Settings, TrendingUp, Code, PenTool, Layers, Zap } from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — WordPress & Shopify Development | Creative Web Boost" },
      { name: "description", content: "Premium WordPress, Shopify, WooCommerce, landing page, SEO, speed and maintenance services." },
      { property: "og:title", content: "Services — Creative Web Boost" },
      { property: "og:description", content: "Full-service web development for ambitious brands." },
    ],
  }),
  component: ServicesPage,
});

const services = [
  { icon: ShoppingBag, title: "Shopify Development", desc: "Custom Shopify Plus stores with bespoke Liquid and headless front-ends.", features: ["Theme architecture", "App integrations", "Checkout customization", "B2B & wholesale"] },
  { icon: Globe, title: "WordPress Websites", desc: "Editorial WordPress and headless setups built for performance and content velocity.", features: ["Custom themes", "ACF / block editor", "Multisite", "Headless with Next.js"] },
  { icon: Layers, title: "WooCommerce", desc: "Scalable WooCommerce stores tuned for speed and conversion.", features: ["Custom checkout", "Subscriptions", "Payment gateways", "Performance tuning"] },
  { icon: PenTool, title: "Landing Pages", desc: "High-converting landing pages launched in days, not weeks.", features: ["Hero design", "A/B test setup", "Lead capture", "Analytics"] },
  { icon: Code, title: "Custom Development", desc: "Apps, integrations, and bespoke functionality across your stack.", features: ["REST / GraphQL APIs", "3rd-party integrations", "Internal tools", "Migrations"] },
  { icon: TrendingUp, title: "Website Redesign", desc: "Modern rebuilds that elevate the brand and lift conversion.", features: ["Brand refresh", "UX audit", "Content strategy", "Launch plan"] },
  { icon: Gauge, title: "Speed Optimization", desc: "Lighthouse 99+ scores and Core Web Vitals overhauls.", features: ["Image pipeline", "Critical CSS", "Server tuning", "Caching"] },
  { icon: Search, title: "SEO Setup", desc: "Technical SEO and content foundations that compound.", features: ["Site audit", "Schema", "Internal linking", "Reporting"] },
  { icon: Settings, title: "Maintenance", desc: "Monthly care plans with monitoring, updates and dev hours.", features: ["Security patches", "Performance monitoring", "Backups", "Priority dev hours"] },
  { icon: Zap, title: "Conversion Audit", desc: "Heatmaps, A/B tests and a roadmap that lifts revenue.", features: ["Session replay", "Funnel analysis", "Test backlog", "Recommendations"] },
];

function ServicesPage() {
  return (
    <SiteShell>
      <section className="bg-mesh py-24 lg:py-28">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-primary">Services</p>
          <h1 className="text-balance text-4xl font-semibold md:text-6xl">
            Everything you need to <span className="gradient-text">grow online</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            From bespoke stores to ongoing optimization, our services compound to deliver sustainable revenue growth.
          </p>
        </div>
      </section>

      <section className="bg-background py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 md:grid-cols-2">
          {services.map((s) => (
            <div key={s.title} className="group rounded-3xl border border-foreground/5 bg-card p-8 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-glow">
              <div className="mb-6 grid size-12 place-items-center rounded-xl bg-mint text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <s.icon className="size-6" />
              </div>
              <h3 className="text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              <ul className="mt-6 grid grid-cols-2 gap-2 text-sm">
                {s.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-foreground/80">
                    <Check className="size-4 shrink-0 text-primary" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 text-center">
          <Link to="/contact" hash="book" className="magnetic-btn inline-flex items-center gap-2 rounded-2xl bg-primary px-7 py-4 text-base font-semibold text-primary-foreground shadow-glow">
            Discuss your project <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
