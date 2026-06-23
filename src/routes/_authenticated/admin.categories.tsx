import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/components/admin/AdminShell";
import { CrudPanel } from "@/components/admin/CrudPanel";

export const Route = createFileRoute("/_authenticated/admin/categories")({
  head: () => ({
    meta: [
      { title: "Categories — Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminCategoriesPage,
});

function AdminCategoriesPage() {
  return (
    <AdminPage title="Categories" description="Group services into browsable categories.">
      <CrudPanel
        table="categories"
        queryKey="admin-categories"
        orderBy="sort_order"
        fields={[
          { name: "name", label: "Name", type: "text", required: true },
          { name: "slug", label: "Slug", type: "text", required: true, placeholder: "e.g. wordpress" },
          { name: "icon", label: "Icon (lucide name or emoji)", type: "text" },
          { name: "description", label: "Description", type: "textarea" },
          { name: "sort_order", label: "Sort Order", type: "number" },
        ]}
        columns={[
          { key: "name", label: "Name" },
          { key: "slug", label: "Slug" },
          { key: "sort_order", label: "Order" },
        ]}
        defaultRow={{ sort_order: 0 }}
      />
    </AdminPage>
  );
}
