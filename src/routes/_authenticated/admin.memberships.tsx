import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/components/admin/AdminShell";
import { CrudPanel } from "@/components/admin/CrudPanel";

export const Route = createFileRoute("/_authenticated/admin/memberships")({
  head: () => ({
    meta: [
      { title: "Memberships — Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminMembershipsPage,
});

function AdminMembershipsPage() {
  return (
    <AdminPage title="Membership Plans" description="Silver, Gold, Platinum verified plans.">
      <CrudPanel
        table="membership_plans"
        queryKey="admin-membership-plans"
        orderBy="sort_order"
        fields={[
          { name: "tier", label: "Tier", type: "select", options: ["silver", "gold", "platinum"], required: true },
          { name: "name", label: "Name", type: "text", required: true },
          { name: "description", label: "Description", type: "textarea" },
          { name: "price_cents", label: "Price (in cents)", type: "number", required: true, placeholder: "e.g. 999 = $9.99" },
          { name: "interval", label: "Interval", type: "select", options: ["month", "year"], required: true },
          { name: "discount_pct", label: "Member Discount %", type: "number" },
          { name: "benefits", label: "Benefits", type: "tags", placeholder: "Comma separated benefit list" },
          { name: "stripe_price_id", label: "Stripe Price ID (optional)", type: "text" },
          { name: "active", label: "Active", type: "boolean" },
          { name: "sort_order", label: "Sort Order", type: "number" },
        ]}
        columns={[
          { key: "name", label: "Name" },
          { key: "tier", label: "Tier" },
          { key: "price_cents", label: "Price ¢" },
          { key: "discount_pct", label: "Discount %" },
          { key: "active", label: "Active", render: (r) => ((r as unknown as { active: boolean }).active ? "Yes" : "No") },
        ]}
        defaultRow={{ active: true, interval: "month", sort_order: 0, discount_pct: 0, benefits: [] }}
      />
    </AdminPage>
  );
}
