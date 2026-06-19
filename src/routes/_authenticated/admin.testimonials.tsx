import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/components/admin/AdminShell";
import { CrudPanel, type Field } from "@/components/admin/CrudPanel";
import type { Testimonial } from "@/lib/cms";

export const Route = createFileRoute("/_authenticated/admin/testimonials")({
  head: () => ({ meta: [{ title: "Testimonials — Admin" }, { name: "robots", content: "noindex" }] }),
  component: TestimonialsAdmin,
});

const fields: Field[] = [
  { name: "client_name", label: "Client name", type: "text", required: true },
  { name: "client_role", label: "Role", type: "text" },
  { name: "company", label: "Company", type: "text" },
  { name: "avatar", label: "Avatar URL", type: "url" },
  { name: "content", label: "Testimonial", type: "textarea", required: true },
  { name: "rating", label: "Rating (1–5)", type: "number" },
  { name: "featured", label: "Featured", type: "boolean" },
  { name: "display_order", label: "Display order", type: "number" },
];

function TestimonialsAdmin() {
  return (
    <AdminPage title="Testimonials" description="Manage client testimonials.">
      <CrudPanel<Testimonial>
        table="testimonials"
        queryKey="admin-testimonials"
        fields={fields}
        defaultRow={{ featured: true, rating: 5, display_order: 0 }}
        columns={[
          { key: "client_name", label: "Client" },
          { key: "company", label: "Company" },
          { key: "rating", label: "Rating" },
          { key: "featured", label: "Featured", render: (r) => r.featured ? "⭐" : "" },
        ]}
      />
    </AdminPage>
  );
}
