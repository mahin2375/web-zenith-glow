import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { createOrder, getMyMembership } from "@/lib/marketplace.functions";
import { getServicePublic } from "@/lib/marketplace";
import { SiteShell } from "@/components/site/SiteShell";
import {
  ShoppingCart, Check, Tag, Loader2,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Creative Web Boost" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const search = useSearch({ strict: false }) as any;
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState("");
  const [requirements, setRequirements] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { data: service } = useQuery({
    queryKey: ["service", search.service],
    queryFn: () => search.service ? getServicePublic("") : Promise.resolve(null),
    enabled: !!search.service,
  });

  const { data: membership } = useQuery({
    queryKey: ["my-membership"],
    queryFn: () => getMyMembership(),
  });

  const createOrderMutation = useMutation({
    mutationFn: (vars: { service_id: string; package_id: string; coupon_code?: string | null; requirements?: string | null }) =>
      createOrder({ data: vars }),
    onSuccess: () => {
      navigate({ to: "/dashboard" });
    },
    onError: (err: any) => {
      setError(err?.message || "Failed to create order");
    },
  });

  const handleSubmit = () => {
    if (!search.service || !search.package) {
      setError("Invalid checkout session");
      return;
    }
    setError(null);
    createOrderMutation.mutate({
      service_id: search.service,
      package_id: search.package,
      coupon_code: couponCode || null,
      requirements: requirements || null,
    });
  };

  if (!search.service || !search.package) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-2xl px-6 py-24 text-center">
          <h1 className="text-2xl font-semibold">Checkout</h1>
          <p className="mt-4 text-muted-foreground">
            No service selected. Browse our <a href="/services" className="text-primary underline">services marketplace</a> to get started.
          </p>
        </div>
      </SiteShell>
    );
  }

  const discountPct = membership?.plan?.discount_pct;
  const hasDiscount = typeof discountPct === "number" && discountPct > 0;

  return (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-2xl font-semibold">Checkout</h1>

        <div className="mt-8 rounded-3xl border border-foreground/5 bg-card p-6 shadow-soft">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <ShoppingCart className="size-5 text-primary" />
            <span>Order Summary</span>
          </div>

          <div className="mt-4 rounded-2xl bg-mint/30 p-4">
            <p className="text-sm text-muted-foreground">Service</p>
            <p className="mt-1 font-medium">{service?.title ?? "Selected Service"}</p>
          </div>

          {hasDiscount && (
            <div className="mt-3 flex items-center gap-2 rounded-2xl bg-primary/10 p-4 text-sm">
              <Tag className="size-4 text-primary" />
              <span className="font-medium text-primary">{discountPct}% membership discount applied</span>
            </div>
          )}

          <div className="mt-4">
            <label className="text-sm font-medium">Coupon Code</label>
            <div className="mt-1.5 flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter code"
                className="flex-1 rounded-xl border border-foreground/10 bg-background px-4 py-2.5 text-sm outline-none ring-primary/30 focus:ring-2"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium">Project Requirements</label>
            <textarea
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="Describe what you need, your brand guidelines, references, etc."
              rows={4}
              className="mt-1.5 w-full rounded-xl border border-foreground/10 bg-background px-4 py-3 text-sm outline-none ring-primary/30 focus:ring-2"
            />
          </div>

          {error && (
            <div className="mt-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
          )}

          <button
            onClick={handleSubmit}
            disabled={createOrderMutation.isPending}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-glow transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {createOrderMutation.isPending ? (
              <><Loader2 className="size-4 animate-spin" /> Processing...</>
            ) : (
              <><Check className="size-4" /> Place Order</>
            )}
          </button>
        </div>
      </div>
    </SiteShell>
  );
}
