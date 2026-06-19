import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/components/admin/AdminShell";
import { CrudPanel, type Field } from "@/components/admin/CrudPanel";
import type { TeamMember } from "@/lib/cms";

export const Route = createFileRoute("/_authenticated/admin/team")({
  head: () => ({ meta: [{ title: "Team — Admin" }, { name: "robots", content: "noindex" }] }),
  component: TeamAdmin,
});

const fields: Field[] = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "role", label: "Role / Designation", type: "text", required: true },
  { name: "bio", label: "Short bio", type: "textarea" },
  { name: "photo", label: "Photo URL", type: "url" },
  { name: "facebook_url", label: "Facebook", type: "url" },
  { name: "instagram_url", label: "Instagram", type: "url" },
  { name: "linkedin_url", label: "LinkedIn", type: "url" },
  { name: "display_order", label: "Display order", type: "number" },
  { name: "published", label: "Published", type: "boolean" },
];

function TeamAdmin() {
  return (
    <AdminPage title="Team" description="Manage your team showcase.">
      <CrudPanel<TeamMember>
        table="team_members"
        queryKey="admin-team"
        fields={fields}
        defaultRow={{ published: true, display_order: 0 }}
        columns={[
          { key: "name", label: "Name" },
          { key: "role", label: "Role" },
          { key: "published", label: "Status", render: (r) => r.published ? "Live" : "Hidden" },
        ]}
      />
    </AdminPage>
  );
}
