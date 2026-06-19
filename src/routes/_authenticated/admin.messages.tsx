import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminPage } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Trash2, Mail } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/messages")({
  head: () => ({ meta: [{ title: "Messages — Admin" }, { name: "robots", content: "noindex" }] }),
  component: MessagesAdmin,
});

type Message = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  project_type: string | null;
  message: string;
  status: string;
  created_at: string;
};

function MessagesAdmin() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Message[];
    },
  });
  const update = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("contact_messages").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-messages"] }); toast.success("Updated"); },
  });
  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("contact_messages").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-messages"] }); toast.success("Deleted"); },
  });

  return (
    <AdminPage title="Contact Messages" description="Inbound inquiries from your website.">
      {isLoading ? (
        <div className="grid place-items-center p-12"><Loader2 className="size-6 animate-spin text-primary" /></div>
      ) : !data || data.length === 0 ? (
        <div className="rounded-3xl border border-foreground/5 bg-card p-12 text-center text-muted-foreground">
          <Mail className="mx-auto mb-3 size-8 text-primary" />
          No messages yet.
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((m) => (
            <div key={m.id} className="rounded-2xl border border-foreground/5 bg-card p-6 shadow-soft">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-semibold">{m.name} <span className="ml-2 text-sm font-normal text-muted-foreground">&lt;{m.email}&gt;</span></p>
                  <p className="text-xs text-muted-foreground">
                    {m.company ? `${m.company} · ` : ""}{m.project_type ?? "General"} · {new Date(m.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select value={m.status} onChange={(e) => update.mutate({ id: m.id, status: e.target.value })} className="rounded-lg border border-foreground/10 bg-background px-3 py-1.5 text-xs">
                    <option value="new">New</option>
                    <option value="in_progress">In progress</option>
                    <option value="done">Done</option>
                  </select>
                  <button onClick={() => { if (confirm("Delete this message?")) del.mutate(m.id); }} className="grid size-8 place-items-center rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground">
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed">{m.message}</p>
              {m.phone && <p className="mt-3 text-xs text-muted-foreground">Phone: {m.phone}</p>}
            </div>
          ))}
        </div>
      )}
    </AdminPage>
  );
}
