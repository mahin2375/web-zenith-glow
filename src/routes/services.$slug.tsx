import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { SiteShell } from "@/components/site/SiteShell";
import { getServicePublic } from "@/lib/marketplace";
import { supabase } from "@/integrations/supabase/client";
import {
  Star, Clock, RefreshCw, Check, ChevronDown, ChevronUp,
  ShoppingCart, Shield, Zap, MessageCircle,
} from "lucide-react";

export const Route = createFileRoute("/services/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} — Service Marketplace` },
      { name: "description", content: "Premium web development service with transparent pricing and packages." },
    ],
  }),
  component: ServiceDetailPage,
});

function ServiceDetailPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState<"basic" | "standard" | "premium">("standard");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const { data: service } = useQuery({
    queryKey: ["service", slug],
    queryFn: () => getServicePublic(slug),
  });

  const packages = useMemo(() => {
    if (!service?.packages) return [];
    const tiers = ["basic", "standard", "premium"] as const;
    return tiers.map((t) => service.packages.find((p: any) => p.tier === t)).filter(Boolean);
  }, [service]);

  const selectedPkg = packages.find((p: any) => p.tier === selectedTier);
  const reviews = service?.reviews?.filter((r: any) => r.approved) ?? [];
  const faq = Array.isArray(service?.faq) ? service.faq : [];

  const handleOrder = () => {
    if (!user) {
      navigate({ to: "/auth" });
      return;
    }
    navigate({ to: "/checkout", search: { service: service.id, package: selectedPkg?.id } });
  };

  if (!service) {
    return (
      <SiteShell>
        <div className="grid min-h-[60vh] place-items-center text-muted-foreground">
          <p>Loading service...</p>
        </div>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <div className="bg-mesh pb-16 pt-10">
        <div className="mx-auto max-w-7xl px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link to="/services" className="hover:text-foreground">Services</Link>
            <span>/</span>
            {service.category && (
              <>
                <span>{service.category.name}</span>
                <span>/</span>
              </>
            )}
            <span className="text-foreground">{service.title}</span>
          </div>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
            {/* Left Column */}
            <div>
              <h1 className="text-2xl font-semibold md:text-4xl">{service.title}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {service.rating_count > 0 && (
                  <span className="flex items-center gap-1">
                    <Star className="size-4 fill-amber-400 text-amber-400" />
                    <span className="font-medium text-foreground">{service.rating_avg}</span>
                    <span>({service.rating_count} reviews)</span>
                  </span>
                )}
                {service.category && <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">{service.category.name}</span>}
              </div>

              {/* Featured Image */}
              <div className="mt-6 overflow-hidden rounded-3xl bg-mint ring-1 ring-foreground/5">
                {service.featured_image ? (
                  <img src={service.featured_image} alt={service.title} className="aspect-video w-full object-cover" />
                ) : (
                  <div className="grid aspect-video place-items-center text-muted-foreground">No featured image</div>
                )}
              </div>

              {/* Description */}
              <div className="mt-10">
                <h2 className="text-xl font-semibold">About this service</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">{service.description}</p>
              </div>

              {/* Features */}
              {service.features?.length > 0 && (
                <div className="mt-10">
                  <h2 className="text-xl font-semibold">What's included</h2>
                  <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {service.features.map((f: string, i: number) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="size-4 shrink-0 text-primary" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Technologies */}
              {service.technologies?.length > 0 && (
                <div className="mt-10">
                  <h2 className="text-xl font-semibold">Technologies</h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {service.technologies.map((t: string, i: number) => (
                      <span key={i} className="rounded-full bg-mint px-3 py-1 text-xs font-medium text-leaf-dark">{t}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQ */}
              {faq.length > 0 && (
                <div className="mt-10">
                  <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
                  <div className="mt-4 space-y-2">
                    {faq.map((item: any, i: number) => (
                      <div key={i} className="rounded-2xl border border-foreground/5 bg-card">
                        <button
                          onClick={() => setOpenFaq(openFaq === i ? null : i)}
                          className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium"
                        >
                          {item.q}
                          {openFaq === i ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                        </button>
                        {openFaq === i && (
                          <div className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">{item.a}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews */}
              {reviews.length > 0 && (
                <div className="mt-10">
                  <h2 className="text-xl font-semibold">Reviews ({reviews.length})</h2>
                  <div className="mt-4 space-y-4">
                    {reviews.map((r: any) => (
                      <div key={r.id} className="rounded-2xl border border-foreground/5 bg-card p-5">
                        <div className="flex items-center gap-3">
                          <div className="grid size-10 place-items-center rounded-full bg-mint text-xs font-bold text-leaf-dark">
                            {r.user?.display_name?.[0] ?? "U"}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{r.user?.display_name ?? "Verified Buyer"}</p>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`size-3 ${i < r.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="mt-3 text-sm text-muted-foreground">{r.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Sticky Card */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-3xl border border-foreground/5 bg-card p-6 shadow-soft">
                {/* Package tabs */}
                <div className="flex rounded-2xl bg-mint/50 p-1">
                  {packages.map((pkg: any) => (
                    <button
                      key={pkg.tier}
                      onClick={() => setSelectedTier(pkg.tier)}
                      className={`flex-1 rounded-xl py-2.5 text-xs font-semibold transition-colors ${
                        selectedTier === pkg.tier
                          ? "bg-primary text-primary-foreground shadow-glow"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {pkg.name}
                    </button>
                  ))}
                </div>

                {selectedPkg && (
                  <div className="mt-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold">${(selectedPkg.price_cents / 100).toFixed(0)}</span>
                      <span className="text-sm text-muted-foreground">USD</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{selectedPkg.description}</p>

                    <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3.5" /> {selectedPkg.delivery_days} day{selectedPkg.delivery_days > 1 ? "s" : ""} delivery
                      </span>
                      <span className="flex items-center gap-1">
                        <RefreshCw className="size-3.5" />
                        {selectedPkg.revisions === -1 ? "Unlimited" : selectedPkg.revisions} revision{selectedPkg.revisions !== 1 ? "s" : ""}
                      </span>
                    </div>

                    <ul className="mt-5 space-y-2">
                      {selectedPkg.features?.map((f: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Check className="mt-0.5 size-4 shrink-0 text-primary" /> {f}
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={handleOrder}
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-glow transition-colors hover:bg-primary/90"
                    >
                      <ShoppingCart className="size-4" /> Order Now
                    </button>
                    <p className="mt-3 text-center text-xs text-muted-foreground">
                      {!user ? "Sign in required to place an order" : "Secure checkout with order protection"}
                    </p>
                  </div>
                )}

                <div className="mt-6 space-y-3 border-t border-foreground/5 pt-5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Shield className="size-4 text-primary" /> Payment protection guaranteed
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Zap className="size-4 text-primary" /> Priority delivery available
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MessageCircle className="size-4 text-primary" /> 24/7 support included
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
