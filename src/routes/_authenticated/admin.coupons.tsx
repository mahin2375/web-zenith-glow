import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/components/admin/AdminShell";
import { CrudPanel } from "@/components/admin/CrudPanel";

export const Route = createFileRoute("/_authenticated/admin/coupons")({
  head: () => ({
    meta: [
      { title: "Coupons — Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminCouponsPage,
});

function AdminCouponsPage() {
  return (
    <AdminPage title="Coupons" description="Percentage or fixed-amount discount codes.">
      <CrudPanel
        table="coupons"
        queryKey="admin-coupons"
        orderBy="code"
        fields={[
          { name: "code", label: "Code", type: "text", required: true, placeholder: "e.g. LAUNCH20" },
          { name: "type", label: "Type", type: "select", options: ["percent", "fixed"], required: true },
          { name: "value", label: "Value (percent 1-100, or cents)", type: "number", required: true },
          { name: "max_uses", label: "Max Uses (blank = unlimited)", type: "number" },
          { name: "expires_at", label: "Expires At (ISO datetime, optional)", type: "text", placeholder: "2026-12-31T23:59:00Z" },
          { name: "min_membership_tier", label: "Minimum Membership", type: "select", options: ["silver", "gold", "platinum"] },
          { name: "active", label: "Active", type: "boolean" },
        ]}
        columns={[
          { key: "code", label: "Code" },
          { key: "type", label: "Type" },
          { key: "value", label: "Value" },
          { key: "used_count", label: "Used" },
          { key: "max_uses", label: "Limit" },
          { key: "active", label: "Active", render: (r) => ((r as unknown as { active: boolean }).active ? "Yes" : "No") },
        ]}
        defaultRow={{ active: true, used_count: 0, type: "percent" }}
      />
    </AdminPage>
  );
}
