import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";
import { ArrowRight, Award, Heart, Sparkles, Target } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Creative Web Boost" },
      { name: "description", content: "Meet Creative Web Boost — a team of strategists, designers and engineers cultivating digital growth for ambitious brands." },
      { property: "og:title", content: "About — Creative Web Boost" },
      { property: "og:description", content: "Our story, mission and values." },
    ],
  }),
  component: AboutPage,
});

const values = [
  { icon: Target, title: "Conversion first", desc: "Beautiful is the baseline. We obsess over what makes users buy." },
  { icon: Sparkles, title: "Craft, always", desc: "Pixel-level care, animation polish, performance discipline." },
  { icon: Heart, title: "Partner energy", desc: "We work like an extension of your team — not a vendor." },
  { icon: Award, title: "Outcome-driven", desc: "We measure success by your numbers, not our deliverables." },
];

const milestones = [
  { year: "2019", title: "Founded", desc: "Three friends with a shared obsession for great e-commerce." },
  { year: "2021", title: "100 launches", desc: "Crossed our first hundred site launches and welcomed Shopify Plus." },
  { year: "2023", title: "Global team", desc: "Engineers and designers across 8 countries serving 32." },
  { year: "2025", title: "400+ launches", desc: "Half a decade of conversion-first work and $40M+ in client revenue." },
];

function AboutPage() {
  return (
    <SiteShell>
      <section className="relative overflow-hidden bg-mesh py-24 lg:py-32">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-primary">About us</p>
          <h1 className="text-balance text-4xl font-semibold leading-tight md:text-6xl">
            We&rsquo;re a studio that <span className="gradient-text">cultivates</span> digital growth.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
            Creative Web Boost is a small, senior team focused entirely on WordPress and Shopify ecosystems. We design, engineer, and grow modern brands online.
          </p>
        </div>
      </section>

      <section className="bg-background py-24">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-3">
          {[
            { title: "Mission", body: "Help ambitious brands grow online with conversion-first design and engineering." },
            { title: "Vision", body: "A world where every great brand has a digital presence that does it justice." },
            { title: "Promise", body: "Premium craft, transparent process, and measurable outcomes — every project." },
          ].map((b) => (
            <div key={b.title} className="rounded-3xl border border-foreground/5 bg-card p-8 shadow-soft">
              <h3 className="text-2xl font-semibold">{b.title}</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-mint/40 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">Values</p>
            <h2 className="text-3xl font-semibold md:text-4xl">What we believe</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="rounded-3xl border border-foreground/5 bg-card p-6">
                <div className="mb-4 grid size-10 place-items-center rounded-lg bg-mint text-primary">
                  <v.icon className="size-5" />
                </div>
                <h4 className="font-semibold">{v.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-24">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-12">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">Timeline</p>
            <h2 className="text-3xl font-semibold md:text-4xl">A short history of growth</h2>
          </div>
          <ol className="relative border-l border-foreground/10 pl-8">
            {milestones.map((m) => (
              <li key={m.year} className="mb-10 last:mb-0">
                <span className="absolute -left-2 grid size-4 place-items-center rounded-full bg-primary ring-4 ring-background" />
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">{m.year}</p>
                <h4 className="mt-1 text-lg font-semibold">{m.title}</h4>
                <p className="mt-1 text-sm text-muted-foreground">{m.desc}</p>
              </li>
            ))}
          </ol>
          <div className="mt-12 text-center">
            <Link to="/contact" hash="book" className="magnetic-btn inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow">
              Start a project <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
