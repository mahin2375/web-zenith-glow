import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { ArrowRight, ExternalLink, Search } from "lucide-react";
import { useProjects } from "@/lib/cms";
import { seedProjects } from "@/lib/seed-content";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — Creative Web Boost" },
      { name: "description", content: "Selected WordPress and Shopify projects we've shipped for ambitious brands." },
      { property: "og:title", content: "Portfolio — Creative Web Boost" },
      { property: "og:description", content: "Real brands. Real revenue. Real results." },
    ],
  }),
  component: PortfolioPage,
});

function PortfolioPage() {
  const [filter, setFilter] = useState<string>("All");
  const [search, setSearch] = useState("");
  const { data } = useProjects();
  const all = data && data.length > 0 ? data : seedProjects;
  const filters = ["All", "Shopify", "WordPress", "Landing Page", "Ecommerce"];
  const items = all
    .filter((p) => filter === "All" || p.category === filter)
    .filter((p) => !search || p.title.toLowerCase().includes(search.toLowerCase()) || (p.client ?? "").toLowerCase().includes(search.toLowerCase()));

  return (
    <SiteShell>
      <section className="bg-mesh py-24 lg:py-28">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-primary">Portfolio</p>
          <h1 className="text-balance text-4xl font-semibold md:text-6xl">
            Selected works from our <span className="gradient-text">digital garden</span>
          </h1>
        </div>
      </section>

      <section className="bg-background py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    filter === f ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="relative md:w-72">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects"
                className="w-full rounded-full border border-foreground/10 bg-card py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          {items.length === 0 ? (
            <p className="py-24 text-center text-muted-foreground">No projects match your search.</p>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {items.map((p) => (
                <div key={p.id} className="group">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-mint ring-1 ring-foreground/5">
                    {p.cover_image && (
                      <img src={p.cover_image} alt={p.title} loading="lazy" className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    )}
                  </div>
                  <div className="mt-4 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-primary">{p.category}</p>
                      <h3 className="mt-1 text-lg font-semibold">{p.title}</h3>
                      {p.client && <p className="text-sm text-muted-foreground">{p.client}</p>}
                    </div>
                    {p.live_url && (
                      <a href={p.live_url} target="_blank" rel="noreferrer" aria-label={`Visit ${p.title}`} className="grid size-9 place-items-center rounded-full bg-mint text-primary hover:bg-primary hover:text-primary-foreground">
                        <ExternalLink className="size-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-16 text-center">
            <Link to="/contact" hash="book" className="magnetic-btn inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow">
              Start your project <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
