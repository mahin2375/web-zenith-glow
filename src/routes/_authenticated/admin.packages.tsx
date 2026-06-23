import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminShell";
import { CrudPanel } from "@/components/admin/CrudPanel";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/packages")({
  head: () => ({
    meta: [
      { title: "Service Packages — Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPackagesPage,
});

function AdminPackagesPage() {
  const { data: services, isLoading } = useQuery({
    queryKey: ["admin-services-min"],
    queryFn: async () => {
      const { data, error } = await supabase.from("services").select("id, title").order("title");
      if (error) throw error;
      return data as { id: string; title: string }[];
    },
  });

  if (isLoading || !services) {
    return (
      <AdminPage title="Service Packages">
        <div className="grid place-items-center p-12"><Loader2 className="size-6 animate-spin text-primary" /></div>
      </AdminPage>
    );
  }

  const serviceIds = services.map((s) => s.id);
  const serviceLabels = Object.fromEntries(services.map((s) => [s.id, s.title]));

  return (
    <AdminPage title="Service Packages" description="Basic / Standard / Premium tiers per service.">
      <CrudPanel
        table="service_packages"
        queryKey="admin-packages"
        orderBy="service_id"
        fields={[
          { name: "service_id", label: "Service", type: "select", required: true, options: serviceIds, optionLabels: serviceLabels },
          { name: "tier", label: "Tier", type: "select", required: true, options: ["basic", "standard", "premium"] },
          { name: "name", label: "Package Name", type: "text", required: true },
          { name: "description", label: "Description", type: "textarea" },
          { name: "price_cents", label: "Price (cents)", type: "number", required: true },
          { name: "delivery_days", label: "Delivery Days", type: "number", required: true },
          { name: "revisions", label: "Revisions (-1 = unlimited)", type: "number", required: true },
          { name: "features", label: "Features", type: "tags", placeholder: "Comma separated" },
        ]}
        columns={[
          { key: "service_id", label: "Service", render: (r) => serviceLabels[(r as unknown as { service_id: string }).service_id] ?? "—" },
          { key: "tier", label: "Tier" },
          { key: "name", label: "Name" },
          { key: "price_cents", label: "Price ¢" },
          { key: "delivery_days", label: "Days" },
        ]}
        defaultRow={{ tier: "basic", price_cents: 0, delivery_days: 3, revisions: 1, features: [] }}
      />
    </AdminPage>
  );
}
