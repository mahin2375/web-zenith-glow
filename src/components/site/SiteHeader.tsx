import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Leaf, Menu, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const nav = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setHasSession(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setHasSession(!!s));
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-foreground/5 glass-card">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2.5 font-semibold tracking-tight">
          <span className="grid size-8 place-items-center rounded-lg bg-primary shadow-glow">
            <Leaf className="size-4 text-primary-foreground" strokeWidth={2.5} />
          </span>
          <span className="text-lg">CreativeWebBoost</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === item.to ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          {hasSession ? (
            <Link
              to="/admin"
              className="rounded-full bg-foreground/5 px-4 py-2 text-sm font-medium text-foreground hover:bg-foreground/10"
            >
              Admin
            </Link>
          ) : null}
          <Link
            to="/contact"
            hash="book"
            className="magnetic-btn rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground ring-1 ring-primary/20 hover:bg-primary/90"
          >
            Book a Meeting
          </Link>
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden rounded-md p-2 text-foreground/70 hover:bg-foreground/5"
          aria-label="Toggle menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-foreground/5 bg-background md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 hover:bg-foreground/5"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/contact"
              hash="book"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-primary px-5 py-2.5 text-center text-sm font-semibold text-primary-foreground"
            >
              Book a Meeting
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
