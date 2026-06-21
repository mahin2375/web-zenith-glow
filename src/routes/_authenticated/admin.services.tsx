import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/components/admin/AdminShell";
import { CrudPanel } from "@/components/admin/CrudPanel";

export const Route = createFileRoute("/_authenticated/admin/services")({
  head: () => ({
    meta: [
      { title: "Services — Admin | Creative Web Boost" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminServicesPage,
});

function AdminServicesPage() {
  return (
    <AdminPage title="Services" description="Manage marketplace services.">
      <CrudPanel
        table="services"
        queryKey="admin-services"
        fields={[
          { name: "title", label: "Title", type: "text", required: true },
          { name: "slug", label: "Slug", type: "text", required: true },
          { name: "short_description", label: "Short Description", type: "textarea" },
          { name: "description", label: "Description", type: "textarea" },
          { name: "featured_image", label: "Featured Image URL", type: "url" },
          { name: "status", label: "Status", type: "select", options: ["active", "draft", "archived"] },
          { name: "technologies", label: "Technologies", type: "tags", placeholder: "Comma separated" },
          { name: "tags", label: "Tags", type: "tags", placeholder: "Comma separated" },
          { name: "features", label: "Features", type: "tags", placeholder: "Comma separated" },
        ]}
        columns={[
          { key: "title", label: "Title" },
          { key: "slug", label: "Slug" },
          { key: "status", label: "Status" },
        ]}
        defaultRow={{ status: "draft" }}
      />
    </AdminPage>
  );
}
