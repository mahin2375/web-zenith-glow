import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/components/admin/AdminShell";
import { CrudPanel, type Field } from "@/components/admin/CrudPanel";
import type { Project } from "@/lib/cms";

export const Route = createFileRoute("/_authenticated/admin/projects")({
  head: () => ({ meta: [{ title: "Projects — Admin" }, { name: "robots", content: "noindex" }] }),
  component: ProjectsAdmin,
});

const fields: Field[] = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "slug", label: "Slug", type: "text", required: true, placeholder: "nordic-oak" },
  { name: "category", label: "Category", type: "select", required: true, options: ["Shopify", "WordPress", "Landing Page", "Ecommerce", "Business"] },
  { name: "client", label: "Client", type: "text" },
  { name: "description", label: "Description", type: "textarea" },
  { name: "technologies", label: "Technologies", type: "tags" },
  { name: "cover_image", label: "Cover image URL", type: "url" },
  { name: "live_url", label: "Live URL", type: "url" },
  { name: "featured", label: "Featured", type: "boolean" },
  { name: "published", label: "Published", type: "boolean" },
  { name: "display_order", label: "Display order", type: "number" },
];

function ProjectsAdmin() {
  return (
    <AdminPage title="Projects" description="Manage your portfolio.">
      <CrudPanel<Project>
        table="projects"
        queryKey="admin-projects"
        fields={fields}
        defaultRow={{ published: true, featured: false, display_order: 0, technologies: [] }}
        columns={[
          { key: "title", label: "Title" },
          { key: "category", label: "Category" },
          { key: "client", label: "Client" },
          { key: "featured", label: "Featured", render: (r) => r.featured ? "⭐" : "" },
          { key: "published", label: "Status", render: (r) => r.published ? "Published" : "Draft" },
        ]}
      />
    </AdminPage>
  );
}
