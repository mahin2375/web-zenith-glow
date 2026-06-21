import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/components/admin/AdminShell";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Loader2, Package, CheckCircle, XCircle, Clock, RotateCcw } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/orders")({
  head: () => ({
    meta: [
      { title: "Orders — Admin | Creative Web Boost" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminOrdersPage,
});

const statusBadges: Record<string, string> = {
  pending: "bg-amber-50 text-amber-600",
  in_progress: "bg-primary/10 text-primary",
  revision: "bg-violet-50 text-violet-600",
  completed: "bg-emerald-50 text-emerald-600",
  cancelled: "bg-destructive/10 text-destructive",
};

function AdminOrdersPage() {
  const [filter, setFilter] = useState("");
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*,service:services(title,slug),package:service_packages(tier,name),user:profiles(email,display_name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const filtered = filter ? orders.filter((o: any) => o.status === filter) : orders;

  return (
    <AdminPage title="Orders" description="Manage customer orders and update statuses.">
      <div className="mb-6 flex flex-wrap gap-2">
        <button onClick={() => setFilter("")} className={`rounded-full px-4 py-2 text-xs font-semibold ${!filter ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"}`}>All</button>
        {["pending", "in_progress", "revision", "completed", "cancelled"].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`rounded-full px-4 py-2 text-xs font-semibold ${filter === s ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"}`}>
            {s.replace("_", " ")}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid place-items-center p-12"><Loader2 className="size-6 animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <p className="p-12 text-center text-muted-foreground">No orders found.</p>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-foreground/5 bg-card shadow-soft">
          <table className="w-full text-sm">
            <thead className="border-b border-foreground/5 bg-mint/40 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Package</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/5">
              {filtered.map((order: any) => (
                <tr key={order.id} className="hover:bg-mint/30">
                  <td className="px-4 py-3 font-medium">{order.order_number}</td>
                  <td className="px-4 py-3 text-muted-foreground">{order.user?.display_name || order.user?.email || "—"}</td>
                  <td className="px-4 py-3">{order.service?.title || "—"}</td>
                  <td className="px-4 py-3">{order.package?.name || order.package?.tier || "—"}</td>
                  <td className="px-4 py-3 font-medium">${(order.total_cents / 100).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${statusBadges[order.status] || "bg-muted text-muted-foreground"}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{order.paid ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminPage>
  );
}
