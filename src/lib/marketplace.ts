import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type ServiceWithPackages = {
  id: string;
  slug: string;
  title: string;
  short_description: string | null;
  featured_image: string | null;
  rating_avg: number;
  rating_count: number;
  category: { id: string; name: string; slug: string } | null;
  packages: PackageRow[];
  technologies: string[];
  tags: string[];
};

export type PackageRow = {
  id: string;
  tier: "basic" | "standard" | "premium";
  name: string;
  description: string | null;
  price_cents: number;
  delivery_days: number;
  revisions: number;
  features: string[];
};

export type OrderRow = {
  id: string;
  order_number: string;
  status: "pending" | "in_progress" | "revision" | "completed" | "cancelled";
  total_cents: number;
  paid: boolean;
  created_at: string;
  service: { title: string; slug: string; featured_image: string | null } | null;
  package: { tier: string; name: string } | null;
};

export type MembershipPlanRow = {
  id: string;
  tier: "silver" | "gold" | "platinum";
  name: string;
  description: string | null;
  price_cents: number;
  interval: string;
  benefits: string[];
  discount_pct: number;
};

export type CouponRow = {
  id: string;
  code: string;
  type: "percent" | "fixed";
  value: number;
};

export type ReviewRow = {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  user: { display_name: string | null; avatar_url: string | null } | null;
};

export type NotificationRow = {
  id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  read_at: string | null;
  created_at: string;
};

// ============ CLIENT-SIDE HELPERS ============
export async function listServicesPublic(params?: {
  category?: string;
  search?: string;
  sort?: "newest" | "popular" | "rating" | "price_asc" | "price_desc";
}) {
  let q = supabase
    .from("services")
    .select("id,slug,title,short_description,featured_image,rating_avg,rating_count,popularity,created_at,category:categories(id,name,slug),packages(id,tier,name,price_cents,delivery_days,revisions,features)")
    .eq("status", "active");

  if (params?.category) {
    q = q.eq("category.slug", params.category);
  }
  if (params?.search) {
    q = q.or(`title.ilike.%${params.search}%,short_description.ilike.%${params.search}%`);
  }

  if (params?.sort === "popular") q = q.order("popularity", { ascending: false });
  else if (params?.sort === "rating") q = q.order("rating_avg", { ascending: false });
  else if (params?.sort === "price_asc") q = q.order("packages.price_cents", { ascending: true });
  else if (params?.sort === "price_desc") q = q.order("packages.price_cents", { ascending: false });
  else q = q.order("created_at", { ascending: false });

  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as unknown as ServiceWithPackages[];
}

export async function getServicePublic(slug: string) {
  const { data, error } = await supabase
    .from("services")
    .select(
      "*,category:categories(id,name,slug),packages(*),reviews(id,rating,comment,created_at,user:profiles(display_name,avatar_url))"
    )
    .eq("slug", slug)
    .eq("status", "active")
    .single();
  if (error) throw error;
  return data as unknown as any;
}

export async function listCategoriesPublic() {
  const { data, error } = await supabase.from("categories").select("*").order("sort_order");
  if (error) throw error;
  return data ?? [];
}

export async function listMembershipPlansPublic() {
  const { data, error } = await supabase
    .from("membership_plans")
    .select("*")
    .eq("active", true)
    .order("sort_order");
  if (error) throw error;
  return (data ?? []) as unknown as MembershipPlanRow[];
}
