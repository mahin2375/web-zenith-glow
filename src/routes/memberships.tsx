import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteShell } from "@/components/site/SiteShell";
import { listMembershipPlansPublic } from "@/lib/marketplace";
import { supabase } from "@/integrations/supabase/client";
import { Check, Star, Zap, Shield, Crown } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/memberships")({
  head: () => ({
    meta: [
      { title: "Membership Plans — Creative Web Boost" },
      { name: "description", content: "Join as a verified member and unlock exclusive discounts, priority support, and premium resources." },
    ],
  }),
  component: MembershipsPage,
});

const tierIcons = {
  silver: Shield,
  gold: Star,
  platinum: Crown,
};

const tierColors: Record<string, string> = {
  silver: "border-slate-300 bg-gradient-to-b from-slate-50 to-white",
  gold: "border-amber-300 bg-gradient-to-b from-amber-50 to-white",
  platinum: "border-violet-300 bg-gradient-to-b from-violet-50 to-white",
};

const tierBadgeColors: Record<string, string> = {
  silver: "bg-slate-500 text-white",
  gold: "bg-amber-500 text-white",
  platinum: "bg-violet-600 text-white",
};

function MembershipsPage() {
  const { data: plans = [] } = useQuery({
    queryKey: ["membership-plans"],
    queryFn: listMembershipPlansPublic,
  });
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  return (
    <SiteShell>
      <section className="bg-mesh py-20 lg:py-28">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-balance text-3xl font-semibold md:text-5xl">
            Become a <span className="gradient-text">Verified Member</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-muted-foreground">
            Unlock exclusive discounts, priority support, and premium resources. Choose the plan that fits your needs.
          </p>
        </div>
      </section>

      <section className="bg-background py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {plans.map((plan: any) => {
              const Icon = tierIcons[plan.tier as keyof typeof tierIcons] || Shield;
              return (
                <div
                  key={plan.id}
                  className={`relative flex flex-col rounded-3xl border-2 p-8 transition-all hover:-translate-y-1 hover:shadow-glow ${tierColors[plan.tier]}`}
                >
                  <div className={`mb-4 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${tierBadgeColors[plan.tier]}`}>
                    <Icon className="size-3.5" /> {plan.tier}
                  </div>
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-bold">${(plan.price_cents / 100).toFixed(0)}</span>
                    <span className="text-sm text-muted-foreground">/ {plan.interval}</span>
                  </div>
                  <div className="mt-2 text-sm font-medium text-primary">{plan.discount_pct}% discount on all services</div>

                  <ul className="mt-6 flex-1 space-y-3">
                    {plan.benefits?.map((b: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="mt-0.5 size-4 shrink-0 text-primary" /> {b}
                      </li>
                    ))}
                  </ul>

                  <Link
                    to={user ? "/checkout" : "/auth"}
                    search={user ? { membership: plan.id } : undefined}
                    className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-foreground py-3.5 text-sm font-semibold text-background transition-colors hover:bg-foreground/90"
                  >
                    <Zap className="size-4" /> Subscribe Now
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
