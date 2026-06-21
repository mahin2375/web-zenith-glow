import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const listServices = createServerFn({ method: "GET" })
  .inputValidator((data: { category?: string; search?: string; sort?: string } | undefined) => data ?? {})
  .handler(async ({ data }) => {
    const { createClient } = await import("@supabase/supabase-js");
    const supabasePublic = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY!,
      { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } }
    );

    let q = supabasePublic
      .from("services")
      .select("id,slug,title,short_description,featured_image,rating_avg,rating_count,popularity,created_at,category:categories(id,name,slug),packages(id,tier,name,price_cents,delivery_days,revisions,features)")
      .eq("status", "active");

    if (data?.category) q = q.eq("category.slug", data.category);
    if (data?.search) {
      q = q.or(`title.ilike.%${data.search}%,short_description.ilike.%${data.search}%`);
    }

    if (data?.sort === "popular") q = q.order("popularity", { ascending: false });
    else if (data?.sort === "rating") q = q.order("rating_avg", { ascending: false });
    else if (data?.sort === "price_asc") q = q.order("packages.price_cents", { ascending: true });
    else if (data?.sort === "price_desc") q = q.order("packages.price_cents", { ascending: false });
    else q = q.order("created_at", { ascending: false });

    const { data: rows, error } = await q;
    if (error) throw error;
    return rows ?? [];
  });

export const getService = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const { createClient } = await import("@supabase/supabase-js");
    const supabasePublic = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY!,
      { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } }
    );

    const { data: row, error } = await supabasePublic
      .from("services")
      .select("*,category:categories(id,name,slug),packages(*),reviews(id,rating,comment,created_at,approved,user:profiles(id,display_name,avatar_url))")
      .eq("slug", data.slug)
      .eq("status", "active")
      .single();
    if (error) throw error;
    return row;
  });

export const listCategories = createServerFn({ method: "GET" })
  .handler(async () => {
    const { createClient } = await import("@supabase/supabase-js");
    const supabasePublic = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY!,
      { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } }
    );
    const { data, error } = await supabasePublic.from("categories").select("*").order("sort_order");
    if (error) throw error;
    return data ?? [];
  });

export const createOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { service_id: string; package_id: string; coupon_code?: string | null; requirements?: string | null }) => data)
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: pkg, error: pkgErr } = await supabaseAdmin
      .from("service_packages")
      .select("*,service:services(id,slug,title)")
      .eq("id", data.package_id)
      .single();
    if (pkgErr || !pkg) throw new Error("Package not found");

    let totalCents = pkg.price_cents;
    let membershipDiscountCents = 0;
    let couponDiscountCents = 0;
    let couponId: string | null = null;

    // Apply active membership discount
    const { data: membership } = await supabaseAdmin
      .from("user_memberships")
      .select("plan:membership_plans(discount_pct)")
      .eq("user_id", context.userId)
      .eq("status", "active")
      .order("current_period_end", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (membership?.plan?.discount_pct) {
      membershipDiscountCents = Math.round((pkg.price_cents * membership.plan.discount_pct) / 100);
      totalCents -= membershipDiscountCents;
    }

    // Apply coupon
    if (data.coupon_code) {
      const { data: coupon } = await supabaseAdmin
        .from("coupons")
        .select("*")
        .eq("code", data.coupon_code.trim().toUpperCase())
        .eq("active", true)
        .maybeSingle();
      if (coupon) {
        const canUse = (!coupon.max_uses || coupon.used_count < coupon.max_uses) &&
          (!coupon.expires_at || new Date(coupon.expires_at) > new Date()) &&
          (!coupon.user_id || coupon.user_id === context.userId);
        if (canUse) {
          couponId = coupon.id;
          if (coupon.type === "percent") {
            couponDiscountCents = Math.round((totalCents * coupon.value) / 100);
          } else {
            couponDiscountCents = Math.min(coupon.value, totalCents);
          }
          totalCents -= couponDiscountCents;
        }
      }
    }

    const { data: order, error: orderErr } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: context.userId,
        service_id: data.service_id,
        package_id: data.package_id,
        price_cents: pkg.price_cents,
        membership_discount_cents: membershipDiscountCents,
        coupon_discount_cents: couponDiscountCents,
        coupon_id: couponId,
        total_cents: Math.max(totalCents, 0),
        delivery_days: pkg.delivery_days,
        revisions: pkg.revisions,
        requirements: data.requirements,
      })
      .select("*")
      .single();
    if (orderErr) throw orderErr;

    // If coupon used, increment and log redemption
    if (couponId) {
      await supabaseAdmin.from("coupons").update({ used_count: (pkg as any).used_count + 1 }).eq("id", couponId);
      await supabaseAdmin.from("coupon_redemptions").insert({ coupon_id: couponId, user_id: context.userId, order_id: order.id });
    }

    return order;
  });

export const listMyOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("orders")
      .select("id,order_number,status,total_cents,paid,created_at,service:services(title,slug,featured_image),package:service_packages(tier,name)")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  });

export const getMyOrder = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("orders")
      .select("*,service:services(*),package:service_packages(*),status_history:order_status_history(*,changed_by:profiles(display_name)),messages:order_messages(*,sender:profiles(display_name,avatar_url))")
      .eq("id", data.id)
      .eq("user_id", context.userId)
      .single();
    if (error) throw error;
    return row;
  });

export const listMembershipPlans = createServerFn({ method: "GET" })
  .handler(async () => {
    const { createClient } = await import("@supabase/supabase-js");
    const supabasePublic = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY!,
      { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } }
    );
    const { data, error } = await supabasePublic.from("membership_plans").select("*").eq("active", true).order("sort_order");
    if (error) throw error;
    return data ?? [];
  });

export const getMyMembership = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("user_memberships")
      .select("*,plan:membership_plans(*)")
      .eq("user_id", context.userId)
      .eq("status", "active")
      .order("current_period_end", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data ?? null;
  });

export const listMyNotifications = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("notifications")
      .select("*")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw error;
    return data ?? [];
  });

export const markNotificationRead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("id", data.id)
      .eq("user_id", context.userId);
    if (error) throw error;
    return { ok: true };
  });
