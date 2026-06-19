import { Link } from "@tanstack/react-router";
import { Leaf, Mail, Phone, MessageCircle } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-foreground/5 bg-mint/40">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 font-semibold">
              <span className="grid size-8 place-items-center rounded-lg bg-primary shadow-glow">
                <Leaf className="size-4 text-primary-foreground" strokeWidth={2.5} />
              </span>
              <span className="text-lg">CreativeWebBoost</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Premium WordPress and Shopify development. We grow brands online with conversion-first design and engineering.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Explore</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/services" className="hover:text-primary">Services</Link></li>
              <li><Link to="/portfolio" className="hover:text-primary">Portfolio</Link></li>
              <li><Link to="/about" className="hover:text-primary">About</Link></li>
              <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Connect</h4>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Mail className="size-4 text-primary" />hello@creativewebboost.com</li>
              <li className="flex items-center gap-2"><Phone className="size-4 text-primary" />+1 (555) 010-0420</li>
              <li className="flex items-center gap-2"><MessageCircle className="size-4 text-primary" />WhatsApp Support</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-foreground/5 pt-8 text-sm text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} Creative Web Boost. Cultivating digital ecosystems.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary">Twitter</a>
            <a href="#" className="hover:text-primary">LinkedIn</a>
            <a href="#" className="hover:text-primary">YouTube</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
