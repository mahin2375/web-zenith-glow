import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { listMyOrders, getMyMembership, listMyNotifications } from "@/lib/marketplace.functions";
import { SiteShell } from "@/components/site/SiteShell";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import {
  Package, Clock, CheckCircle, AlertCircle, Loader2,
  Crown, Shield, Star, Bell, ArrowRight, ShoppingBag,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Creative Web Boost" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DashboardPage,
});

const statusIcons: Record<string, any> = {
  pending: AlertCircle,
  in_progress: Clock,
  revision: Clock,
  completed: CheckCircle,
  cancelled: AlertCircle,
};

const statusColors: Record<string, string> = {
  pending: "text-amber-500 bg-amber-50",
  in_progress: "text-primary bg-primary/10",
  revision: "text-violet-500 bg-violet-50",
  completed: "text-emerald-500 bg-emerald-50",
  cancelled: "text-destructive bg-destructive/10",
};

const tierIcons: Record<string, any> = {
  silver: Shield,
  gold: Star,
  platinum: Crown,
};

const tierColors: Record<string, string> = {
  silver: "bg-slate-100 text-slate-600",
  gold: "bg-amber-100 text-amber-600",
  platinum: "bg-violet-100 text-violet-600",
};

function DashboardPage() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        supabase.from("profiles").select("*").eq("id", data.user.id).single().then(({ data: p }) => setProfile(p));
      }
    });
  }, []);

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["my-orders"],
    queryFn: () => listMyOrders(),
  });

  const { data: membership } = useQuery({
    queryKey: ["my-membership"],
    queryFn: () => getMyMembership(),
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ["my-notifications"],
    queryFn: () => listMyNotifications(),
  });

  const activeOrders = orders.filter((o: any) => o.status !== "completed" && o.status !== "cancelled");
  const completedOrders = orders.filter((o: any) => o.status === "completed");
  const unreadCount = notifications.filter((n: any) => !n.read_at).length;

  return (
    <SiteShell>
      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Welcome */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">
              Welcome back, {profile?.display_name || profile?.email?.split("@")[0] || "Member"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">Here is everything happening with your account.</p>
          </div>
          {membership?.plan && (
            <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider ${tierColors[membership.plan.tier] || "bg-mint text-leaf-dark"}`}>
              {(() => {
                const Icon = tierIcons[membership.plan.tier] || Shield;
                return <Icon className="size-3.5" />;
              })()}
              {membership.plan.name} Member
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-foreground/5 bg-card p-5 shadow-soft">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <ShoppingBag className="size-4 text-primary" /> Total Orders
            </div>
            <div className="mt-2 text-2xl font-bold">{orders.length}</div>
          </div>
          <div className="rounded-2xl border border-foreground/5 bg-card p-5 shadow-soft">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Clock className="size-4 text-amber-500" /> Active
            </div>
            <div className="mt-2 text-2xl font-bold">{activeOrders.length}</div>
          </div>
          <div className="rounded-2xl border border-foreground/5 bg-card p-5 shadow-soft">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <CheckCircle className="size-4 text-emerald-500" /> Completed
            </div>
            <div className="mt-2 text-2xl font-bold">{completedOrders.length}</div>
          </div>
          <div className="rounded-2xl border border-foreground/5 bg-card p-5 shadow-soft">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Bell className="size-4 text-violet-500" /> Notifications
            </div>
            <div className="mt-2 text-2xl font-bold">{unreadCount}</div>
          </div>
        </div>

        {/* Orders */}
        <div className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
            <Link to="/services" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              Browse Services <ArrowRight className="size-3.5" />
            </Link>
          </div>

          {ordersLoading ? (
            <div className="mt-6 flex items-center gap-2 text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-foreground/10 bg-card p-10 text-center">
              <Package className="mx-auto size-8 text-muted-foreground" />
              <p className="mt-3 text-sm font-medium">No orders yet</p>
              <p className="mt-1 text-xs text-muted-foreground">Browse services and place your first order.</p>
              <Link to="/services" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
                Explore Services <ArrowRight className="size-3.5" />
              </Link>
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {orders.map((order: any) => {
                const StatusIcon = statusIcons[order.status] || AlertCircle;
                return (
                  <div key={order.id} className="flex items-center gap-4 rounded-2xl border border-foreground/5 bg-card p-4 shadow-soft">
                    <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-mint">
                      <Package className="size-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{order.service?.title ?? "Service"}</span>
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${statusColors[order.status] || "text-muted-foreground bg-muted"}`}>
                          <StatusIcon className="size-3" /> {order.status.replace("_", " ")}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">{order.order_number} · {order.package?.name ?? order.package?.tier}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">${(order.total_cents / 100).toFixed(2)}</div>
                      <div className="text-[10px] text-muted-foreground">{order.paid ? "Paid" : "Unpaid"}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Membership banner */}
        {!membership && (
          <div className="mt-10 rounded-3xl border border-foreground/5 bg-card p-8 shadow-soft">
            <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
              <div className="flex-1">
                <h3 className="text-lg font-semibold">Become a Verified Member</h3>
                <p className="mt-1 text-sm text-muted-foreground">Unlock discounts, priority support, and exclusive resources.</p>
              </div>
              <Link to="/memberships" className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow">
                View Plans <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </SiteShell>
  );
}
