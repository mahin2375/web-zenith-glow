import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SiteShell } from "@/components/site/SiteShell";
import { ServiceCard } from "@/components/marketplace/ServiceCard";
import { listServicesPublic, listCategoriesPublic } from "@/lib/marketplace";
import { Search, SlidersHorizontal, X } from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services Marketplace — Creative Web Boost" },
      { name: "description", content: "Browse premium web development services. WordPress, Shopify, landing pages, SEO, and more." },
      { property: "og:title", content: "Services Marketplace — Creative Web Boost" },
      { property: "og:description", content: "Browse premium web development services." },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  const { data: services = [] } = useQuery({
    queryKey: ["services", category, search, sort],
    queryFn: () => listServicesPublic({ category, search, sort: sort as any }),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: listCategoriesPublic,
  });

  const activeFilters = [category && "Category", search && "Search"].filter(Boolean);

  return (
    <SiteShell>
      <section className="bg-mesh py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h1 className="text-balance text-3xl font-semibold md:text-5xl">
              Services <span className="gradient-text">Marketplace</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Browse our catalog of premium web development services. Each service includes detailed packages, transparent pricing, and delivery timelines.
            </p>
          </div>

          <div className="mx-auto mt-10 flex max-w-3xl flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search services..."
                className="h-12 w-full rounded-2xl border border-foreground/10 bg-card pl-10 pr-4 text-sm outline-none ring-primary/30 transition-shadow focus:ring-2"
              />
            </div>
            <button
              onClick={() => setShowFilters((v) => !v)}
              className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-foreground/10 bg-card px-5 text-sm font-medium transition-colors hover:bg-foreground/5"
            >
              <SlidersHorizontal className="size-4" /> Filters
            </button>
          </div>

          {showFilters && (
            <div className="mx-auto mt-4 flex max-w-3xl flex-wrap items-center gap-3">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-10 rounded-xl border border-foreground/10 bg-card px-3 text-sm outline-none"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>{c.name}</option>
                ))}
              </select>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="h-10 rounded-xl border border-foreground/10 bg-card px-3 text-sm outline-none"
              >
                <option value="newest">Newest</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
              {activeFilters.length > 0 && (
                <button
                  onClick={() => { setCategory(""); setSearch(""); setSort("newest"); }}
                  className="flex h-10 items-center gap-1 rounded-xl px-3 text-sm text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3.5" /> Clear
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="bg-background py-16">
        <div className="mx-auto max-w-7xl px-6">
          {services.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">
              <p className="text-lg font-medium">No services found</p>
              <p className="mt-2 text-sm">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service: any) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
