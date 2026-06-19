import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/components/admin/AdminShell";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FolderKanban, Users, Youtube, MessageSquare, Mail, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({ meta: [{ title: "Admin — Creative Web Boost" }, { name: "robots", content: "noindex" }] }),
  component: AdminHome,
});

function useCount(table: "projects" | "team_members" | "youtube_videos" | "testimonials" | "contact_messages") {
  return useQuery({
    queryKey: ["count", table],
    queryFn: async () => {
      const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true });
      if (error) throw error;
      return count ?? 0;
    },
  });
}

function AdminHome() {
  const projects = useCount("projects");
  const team = useCount("team_members");
  const videos = useCount("youtube_videos");
  const testimonials = useCount("testimonials");
  const messages = useCount("contact_messages");

  const cards = [
    { label: "Projects", icon: FolderKanban, count: projects.data, color: "bg-primary/10 text-primary" },
    { label: "Team Members", icon: Users, count: team.data, color: "bg-leaf/15 text-leaf-dark" },
    { label: "YouTube Videos", icon: Youtube, count: videos.data, color: "bg-destructive/10 text-destructive" },
    { label: "Testimonials", icon: MessageSquare, count: testimonials.data, color: "bg-mint-deep text-leaf-dark" },
    { label: "Contact Messages", icon: Mail, count: messages.data, color: "bg-accent text-accent-foreground" },
  ];

  return (
    <AdminPage title="Dashboard" description="Welcome back. Here's your studio at a glance.">
      <div className="rounded-3xl border border-foreground/5 bg-card p-6 shadow-soft">
        <div className="mb-5 flex items-center gap-3 text-sm text-muted-foreground">
          <Sparkles className="size-4 text-primary" /> Content overview
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {cards.map((c) => (
            <div key={c.label} className="rounded-2xl border border-foreground/5 bg-background p-5">
              <div className={`grid size-10 place-items-center rounded-lg ${c.color}`}>
                <c.icon className="size-5" />
              </div>
              <div className="mt-4 text-3xl font-semibold">{c.count ?? "—"}</div>
              <p className="mt-1 text-xs text-muted-foreground">{c.label}</p>
            </div>
          ))}
        </div>
      </div>
    </AdminPage>
  );
}
