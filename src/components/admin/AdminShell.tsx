import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Leaf, LogOut, LayoutDashboard, FolderKanban, Users, Youtube, MessageSquare, Mail, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/projects", label: "Projects", icon: FolderKanban },
  { to: "/admin/team", label: "Team", icon: Users },
  { to: "/admin/videos", label: "YouTube", icon: Youtube },
  { to: "/admin/testimonials", label: "Testimonials", icon: MessageSquare },
  { to: "/admin/messages", label: "Messages", icon: Mail },
] as const;

export function AdminShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const nav2 = useNavigate();
  const qc = useQueryClient();
  const [role, setRole] = useState<"admin" | "editor" | null | "loading">("loading");

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) {
        nav2({ to: "/auth" });
        return;
      }
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", u.user.id);
      if (error) {
        setRole(null);
        return;
      }
      if (!data || data.length === 0) {
        setRole(null);
        return;
      }
      const roles = data.map((r) => r.role);
      setRole(roles.includes("admin") ? "admin" : "editor");
    })();
  }, [nav2]);

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    nav2({ to: "/auth", replace: true });
  }

  if (role === "loading") {
    return (
      <div className="grid min-h-dvh place-items-center bg-mesh">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  if (role === null) {
    return (
      <div className="grid min-h-dvh place-items-center bg-mesh p-6">
        <div className="max-w-md rounded-3xl bg-card p-8 text-center shadow-soft">
          <h1 className="text-xl font-semibold">No admin access</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your account is signed in but doesn&rsquo;t have an admin or editor role yet. Ask a Super Admin to grant you access.
          </p>
          <button onClick={signOut} className="mt-6 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground">
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-dvh bg-mint/40 md:grid-cols-[260px_1fr]">
      <aside className="hidden border-r border-foreground/5 bg-card md:flex md:flex-col">
        <Link to="/" className="flex items-center gap-2.5 border-b border-foreground/5 px-6 py-5 font-semibold">
          <span className="grid size-8 place-items-center rounded-lg bg-primary"><Leaf className="size-4 text-primary-foreground" /></span>
          CreativeWebBoost
        </Link>
        <nav className="flex-1 space-y-1 p-3">
          {nav.map((n) => {
            const active = path === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                }`}
              >
                <n.icon className="size-4" /> {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-foreground/5 p-3">
          <button onClick={signOut} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
            <LogOut className="size-4" /> Sign out
          </button>
        </div>
      </aside>
      <div className="flex flex-col">
        <header className="flex items-center justify-between border-b border-foreground/5 bg-card px-6 py-4 md:hidden">
          <Link to="/admin" className="font-semibold">Admin</Link>
          <button onClick={signOut} className="text-sm text-muted-foreground">Sign out</button>
        </header>
        <main className="flex-1 overflow-x-hidden p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}

export function AdminPage({ children, title, description }: { children: ReactNode; title: string; description?: string }) {
  return (
    <AdminShell>
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          {description && <p className="mt-1 text-muted-foreground">{description}</p>}
        </div>
        {children}
      </div>
    </AdminShell>
  );
}

export { Outlet };
