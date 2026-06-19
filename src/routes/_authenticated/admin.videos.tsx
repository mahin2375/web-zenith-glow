import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/components/admin/AdminShell";
import { CrudPanel, type Field } from "@/components/admin/CrudPanel";
import type { YoutubeVideo } from "@/lib/cms";

export const Route = createFileRoute("/_authenticated/admin/videos")({
  head: () => ({ meta: [{ title: "YouTube — Admin" }, { name: "robots", content: "noindex" }] }),
  component: VideosAdmin,
});

const fields: Field[] = [
  { name: "title", label: "Video title", type: "text", required: true },
  { name: "channel_name", label: "Channel name", type: "text", required: true },
  { name: "youtube_url", label: "YouTube URL", type: "url", required: true },
  { name: "thumbnail", label: "Thumbnail URL", type: "url" },
  { name: "category", label: "Category", type: "text" },
  { name: "featured", label: "Featured", type: "boolean" },
  { name: "display_order", label: "Display order", type: "number" },
];

function VideosAdmin() {
  return (
    <AdminPage title="YouTube Videos" description="Manage your video showcase.">
      <CrudPanel<YoutubeVideo>
        table="youtube_videos"
        queryKey="admin-videos"
        fields={fields}
        defaultRow={{ featured: false, display_order: 0 }}
        columns={[
          { key: "title", label: "Title" },
          { key: "channel_name", label: "Channel" },
          { key: "category", label: "Category" },
          { key: "featured", label: "Featured", render: (r) => r.featured ? "⭐" : "" },
        ]}
      />
    </AdminPage>
  );
}
