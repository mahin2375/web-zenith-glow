import { Link } from "@tanstack/react-router";
import { Star, Clock, RefreshCw } from "lucide-react";

export function ServiceCard({ service }: { service: any }) {
  const minPrice = service.packages?.length
    ? Math.min(...service.packages.map((p: any) => p.price_cents))
    : 0;
  const minDelivery = service.packages?.length
    ? Math.min(...service.packages.map((p: any) => p.delivery_days))
    : 0;

  return (
    <Link
      to="/services/$slug"
      params={{ slug: service.slug }}
      className="group flex flex-col overflow-hidden rounded-3xl border border-foreground/5 bg-card transition-all hover:-translate-y-1 hover:border-primary/20 hover:shadow-glow"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-mint">
        {service.featured_image ? (
          <img
            src={service.featured_image}
            alt={service.title}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid size-full place-items-center text-muted-foreground text-sm">No image</div>
        )}
        <div className="absolute right-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-xs font-semibold backdrop-blur-sm">
          From ${(minPrice / 100).toFixed(0)}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2">
          {service.category && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
              {service.category.name}
            </span>
          )}
        </div>
        <h3 className="mt-2 line-clamp-2 text-base font-semibold leading-snug">{service.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {service.short_description}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          {service.rating_count > 0 && (
            <span className="flex items-center gap-1">
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
              <span className="font-medium text-foreground">{service.rating_avg}</span>
              <span>({service.rating_count})</span>
            </span>
          )}
          {minDelivery > 0 && (
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" /> {minDelivery} day{minDelivery > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
