import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

export type FieldType = "text" | "textarea" | "number" | "boolean" | "url" | "select" | "tags";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  optionLabels?: Record<string, string>;
  placeholder?: string;
};

type Props<T extends { id: string }> = {
  table: "projects" | "team_members" | "youtube_videos" | "testimonials" | "services" | "orders" | "membership_plans" | "coupons" | "categories" | "service_packages";
  queryKey: string;
  fields: Field[];
  columns: { key: keyof T | string; label: string; render?: (row: T) => React.ReactNode }[];
  defaultRow?: Record<string, unknown>;
  orderBy?: string;
};

export function CrudPanel<T extends { id: string }>({ table, queryKey, fields, columns, defaultRow, orderBy = "display_order" }: Props<T>) {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<T | "new" | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const { data, error } = await supabase.from(table).select("*").order(orderBy);
      if (error) throw error;
      return data as unknown as T[];
    },
  });

  const upsert = useMutation({
    mutationFn: async (row: Partial<T> & { id?: string }) => {
      if (row.id) {
        const { id, ...rest } = row;
        const { error } = await (supabase.from(table) as unknown as { update: (v: unknown) => { eq: (k: string, v: string) => Promise<{ error: Error | null }> } }).update(rest).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await (supabase.from(table) as unknown as { insert: (v: unknown) => Promise<{ error: Error | null }> }).insert(row);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [queryKey] });
      qc.invalidateQueries({ queryKey: [queryKey.replace("admin-", "")] });
      setEditing(null);
      toast.success("Saved");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [queryKey] });
      toast.success("Deleted");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Delete failed"),
  });

  return (
    <>
      <div className="mb-6 flex justify-end">
        <button onClick={() => setEditing("new")} className="magnetic-btn inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow">
          <Plus className="size-4" /> New
        </button>
      </div>

      <div className="overflow-hidden rounded-3xl border border-foreground/5 bg-card shadow-soft">
        {isLoading ? (
          <div className="grid place-items-center p-12"><Loader2 className="size-6 animate-spin text-primary" /></div>
        ) : !data || data.length === 0 ? (
          <p className="p-12 text-center text-muted-foreground">No items yet. Click "New" to add the first one.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-foreground/5 bg-mint/40 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                {columns.map((c) => <th key={String(c.key)} className="px-4 py-3">{c.label}</th>)}
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/5">
              {data.map((row) => (
                <tr key={row.id} className="hover:bg-mint/30">
                  {columns.map((c) => (
                    <td key={String(c.key)} className="px-4 py-3">
                      {c.render ? c.render(row) : String((row as Record<string, unknown>)[c.key as string] ?? "")}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setEditing(row)} className="mr-2 inline-flex size-8 items-center justify-center rounded-lg bg-mint text-primary hover:bg-primary hover:text-primary-foreground"><Pencil className="size-3.5" /></button>
                    <button onClick={() => { if (confirm("Delete this item?")) del.mutate(row.id); }} className="inline-flex size-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground"><Trash2 className="size-3.5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editing && (
        <EditDialog
          initial={editing === "new" ? (defaultRow ?? {}) : (editing as Record<string, unknown>)}
          fields={fields}
          onClose={() => setEditing(null)}
          onSave={(row) => upsert.mutate(row as Partial<T>)}
          saving={upsert.isPending}
          title={editing === "new" ? "Create" : "Edit"}
        />
      )}
    </>
  );
}

function EditDialog({ initial, fields, onClose, onSave, saving, title }: {
  initial: Record<string, unknown>;
  fields: Field[];
  onClose: () => void;
  onSave: (row: Record<string, unknown>) => void;
  saving: boolean;
  title: string;
}) {
  const [form, setForm] = useState<Record<string, unknown>>(initial);

  function set(name: string, v: unknown) {
    setForm((f) => ({ ...f, [name]: v }));
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-card shadow-glow">
        <div className="flex items-center justify-between border-b border-foreground/5 px-6 py-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-foreground/5"><X className="size-4" /></button>
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); onSave(form); }}
          className="max-h-[70vh] space-y-4 overflow-y-auto p-6"
        >
          {fields.map((f) => (
            <div key={f.name}>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {f.label}{f.required && " *"}
              </label>
              {f.type === "textarea" ? (
                <textarea
                  required={f.required}
                  value={(form[f.name] as string) ?? ""}
                  onChange={(e) => set(f.name, e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-foreground/10 bg-background px-4 py-3 outline-none focus:border-primary"
                />
              ) : f.type === "boolean" ? (
                <label className="flex items-center gap-3">
                  <input type="checkbox" checked={!!form[f.name]} onChange={(e) => set(f.name, e.target.checked)} className="size-4 rounded border-foreground/20" />
                  <span className="text-sm">{f.placeholder ?? "Enabled"}</span>
                </label>
              ) : f.type === "select" ? (
                <select
                  required={f.required}
                  value={(form[f.name] as string) ?? ""}
                  onChange={(e) => set(f.name, e.target.value)}
                  className="w-full rounded-xl border border-foreground/10 bg-background px-4 py-3 outline-none focus:border-primary"
                >
                  <option value="">Select…</option>
                  {f.options?.map((o) => <option key={o} value={o}>{f.optionLabels?.[o] ?? o}</option>)}
                </select>
              ) : f.type === "tags" ? (
                <input
                  value={(Array.isArray(form[f.name]) ? (form[f.name] as string[]).join(", ") : (form[f.name] as string) ?? "")}
                  onChange={(e) => set(f.name, e.target.value.split(",").map((x) => x.trim()).filter(Boolean))}
                  placeholder="Comma separated"
                  className="w-full rounded-xl border border-foreground/10 bg-background px-4 py-3 outline-none focus:border-primary"
                />
              ) : f.type === "number" ? (
                <input
                  type="number"
                  value={(form[f.name] as number) ?? 0}
                  onChange={(e) => set(f.name, Number(e.target.value))}
                  className="w-full rounded-xl border border-foreground/10 bg-background px-4 py-3 outline-none focus:border-primary"
                />
              ) : (
                <input
                  type={f.type === "url" ? "url" : "text"}
                  required={f.required}
                  value={(form[f.name] as string) ?? ""}
                  onChange={(e) => set(f.name, e.target.value)}
                  placeholder={f.placeholder}
                  className="w-full rounded-xl border border-foreground/10 bg-background px-4 py-3 outline-none focus:border-primary"
                />
              )}
            </div>
          ))}
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="rounded-full bg-foreground/5 px-5 py-2.5 text-sm font-semibold">Cancel</button>
            <button disabled={saving} className="magnetic-btn flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-60">
              {saving && <Loader2 className="size-4 animate-spin" />}
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
