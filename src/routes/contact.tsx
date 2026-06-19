import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { SiteShell } from "@/components/site/SiteShell";
import { Mail, Phone, MapPin, MessageCircle, CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Book a Meeting — Creative Web Boost" },
      { name: "description", content: "Get in touch, send us your project brief, or book a free 15-minute discovery call." },
      { property: "og:title", content: "Contact — Creative Web Boost" },
      { property: "og:description", content: "Book a free meeting or send us a message." },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("Enter a valid email").max(254),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  project_type: z.string().max(60).optional().or(z.literal("")),
  message: z.string().trim().min(1, "Message is required").max(5000),
});

function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setStatus("sending");
    const { error } = await supabase.from("contact_messages").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      company: parsed.data.company || null,
      project_type: parsed.data.project_type || null,
      message: parsed.data.message,
    });
    if (error) {
      setStatus("err");
      setError(error.message);
      return;
    }
    setStatus("ok");
    e.currentTarget.reset();
  }

  return (
    <SiteShell>
      <section className="bg-mesh py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-primary">Contact</p>
          <h1 className="text-balance text-4xl font-semibold md:text-6xl">
            Let&rsquo;s start the <span className="gradient-text">conversation</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            Tell us about your project or book a free 15-minute discovery call.
          </p>
        </div>
      </section>

      <section className="bg-background py-24">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="text-2xl font-semibold">Reach us directly</h2>
            <p className="mt-3 text-muted-foreground">We reply within 1 business day.</p>
            <ul className="mt-8 space-y-5">
              <li className="flex items-center gap-4">
                <span className="grid size-10 place-items-center rounded-xl bg-mint text-primary"><Mail className="size-5" /></span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</p>
                  <p className="font-medium">hello@creativewebboost.com</p>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <span className="grid size-10 place-items-center rounded-xl bg-mint text-primary"><Phone className="size-5" /></span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Phone</p>
                  <p className="font-medium">+1 (555) 010-0420</p>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <span className="grid size-10 place-items-center rounded-xl bg-mint text-primary"><MapPin className="size-5" /></span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Studio</p>
                  <p className="font-medium">Remote-first · Serving 32 countries</p>
                </div>
              </li>
              <li>
                <a href="#" className="magnetic-btn inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
                  <MessageCircle className="size-4" /> WhatsApp us
                </a>
              </li>
            </ul>
            <div id="book" className="mt-12 rounded-3xl border border-foreground/5 bg-mint/40 p-6">
              <h3 className="text-lg font-semibold">Business hours</h3>
              <p className="mt-2 text-sm text-muted-foreground">Mon – Fri · 9am – 6pm (your local timezone)</p>
              <p className="mt-1 text-sm text-muted-foreground">Discovery calls available within 48 hours.</p>
            </div>
          </div>

          <div id="offer" className="rounded-3xl border border-foreground/5 bg-card p-8 shadow-soft">
            <h2 className="text-2xl font-semibold">Send us a message</h2>
            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name" name="name" required />
                <Field label="Email" name="email" type="email" required />
                <Field label="Phone" name="phone" />
                <Field label="Company" name="company" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Project type</label>
                <select name="project_type" defaultValue="" className="w-full rounded-xl border border-foreground/10 bg-background px-4 py-3 outline-none focus:border-primary">
                  <option value="">Select</option>
                  <option>Shopify Development</option>
                  <option>WordPress / Headless</option>
                  <option>Free 5-Product Shopify Store</option>
                  <option>SEO / Optimization</option>
                  <option>Maintenance</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Message</label>
                <textarea name="message" required rows={5} placeholder="Tell us about your project goals…" className="w-full rounded-xl border border-foreground/10 bg-background px-4 py-3 outline-none focus:border-primary" />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              {status === "ok" ? (
                <div className="flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
                  <CheckCircle2 className="size-4" /> Thanks! We&rsquo;ll be in touch within 1 business day.
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="magnetic-btn flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-base font-semibold text-primary-foreground shadow-glow disabled:opacity-60"
                >
                  {status === "sending" ? <Loader2 className="size-4 animate-spin" /> : null}
                  {status === "sending" ? "Sending…" : "Send Inquiry"}
                </button>
              )}
            </form>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

function Field({ label, name, type = "text", required }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}{required && " *"}</label>
      <input type={type} name={name} required={required} className="w-full rounded-xl border border-foreground/10 bg-background px-4 py-3 outline-none focus:border-primary" />
    </div>
  );
}
