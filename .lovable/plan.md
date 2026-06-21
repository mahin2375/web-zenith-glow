# Phase 1 — Premium Service Marketplace

Extends the existing agency site into a Fiverr-style marketplace with auth-gated orders, 3-tier memberships, coupons, and Stripe checkout. Projects/team/videos/testimonials/messages stay intact and become "Portfolio / Team / Reviews" sections.

## What you'll get this phase

### Public marketplace
- `/services` — filterable grid (category, price, tech, rating, newest, popular) with search
- `/services/$slug` — Fiverr-style detail page: gallery, description, features, FAQ, reviews, sticky right card with Basic/Standard/Premium package selector, delivery, revisions, "Order Now"
- `/memberships` — Silver / Gold / Platinum plans with Stripe subscribe
- Guest can browse everything; "Order Now" / "Subscribe" redirect to `/auth`

### Auth-gated user area
- `/dashboard` — welcome, active/pending/completed orders, membership status + badge, billing history, notifications
- `/dashboard/orders/$id` — order detail, status timeline, messages, invoice download (PDF via server fn)
- `/dashboard/settings` — profile (with avatar upload to storage), password update
- Verified badge (silver/gold/platinum) shown next to the user's name everywhere

### Checkout
- `/checkout` — order summary, package, membership discount auto-applied, coupon field, tax, total, Stripe Checkout redirect
- Stripe webhook → marks order paid, creates dashboard notification
- Membership subscriptions via Stripe Billing (monthly), webhook updates `user_memberships`

### Admin (extends current `/admin`)
- `/admin/services` — CRUD services + packages (basic/standard/premium prices, delivery, revisions), gallery upload, FAQ, features, tech, category, tags, status
- `/admin/categories` — service categories CRUD
- `/admin/orders` — list, filter by status, update status (Pending → In Progress → Revision → Completed → Cancelled), refund
- `/admin/memberships` — edit plan name, price, benefits, Stripe price ID
- `/admin/coupons` — percentage / fixed, expiry, usage limit, per-user, membership-restricted
- `/admin/users` — list, view orders, grant/revoke membership manually
- Existing `/admin/team` gets **avatar upload field** added (storage bucket)
- Existing projects → relabeled "Portfolio" with before/after + case study fields
- Reviews moderation under `/admin/reviews`

### Reviews
- Verified-buyer-only review on completed orders (rating, comment, optional images)

### Notifications
- In-app bell with unread badge; realtime via Supabase Realtime on `notifications` table
- Triggers: order status change, payment success, membership expiry warning, admin reply

### Premium feel
- Lenis smooth scroll site-wide + GSAP ScrollTrigger reveal/parallax on marketplace, service detail, memberships, home
- Glassmorphism cards, animated gradient borders on plan cards, floating particles on hero, micro-interactions on buttons/inputs, route transitions

## Tech / data model

New tables (all with RLS + GRANTs, `service_role` full, scoped user policies, admin via `private.has_role`):

- `categories` (name, slug, icon, sort)
- `services` (slug, title, category_id, short_desc, description, features[], tech[], tags[], faq jsonb, gallery[], featured_image, status, popularity, rating_avg, rating_count)
- `service_packages` (service_id, tier enum basic|standard|premium, price_cents, delivery_days, revisions, features[])
- `orders` (user_id, service_id, package_id, status enum, price_cents, discount_cents, coupon_id, membership_discount_cents, total_cents, stripe_session_id, stripe_payment_intent, requirements text, created_at)
- `order_messages` (order_id, sender_id, body, attachments[])
- `order_status_history` (order_id, status, note, created_at)
- `reviews` (order_id unique, user_id, service_id, rating 1-5, comment, images[], approved)
- `membership_plans` (tier enum silver|gold|platinum, name, price_cents, interval, benefits[], discount_pct, stripe_price_id, active)
- `user_memberships` (user_id, plan_id, status, current_period_end, stripe_subscription_id)
- `coupons` (code unique, type percent|fixed, value, max_uses, used_count, expires_at, min_membership_tier, user_id nullable)
- `coupon_redemptions` (coupon_id, user_id, order_id)
- `notifications` (user_id, type, title, body, link, read_at)
- `profiles` gets `avatar_url`, `display_name`
- `team_members` gets `avatar_url` (storage)

Storage buckets: `avatars` (public), `service-gallery` (public), `review-images` (public), `order-attachments` (private, owner-only RLS).

Server functions (createServerFn):
- `services.list / get`, `categories.list`
- `orders.create` (validates package, applies membership %, validates coupon, returns Stripe Checkout URL), `orders.listMine`, `orders.get`, `admin.orders.updateStatus`
- `memberships.subscribe` (Stripe Checkout subscription), `memberships.cancel`
- `coupons.validate`
- `reviews.create` (must own completed order), `reviews.listForService`
- `notifications.listMine`, `notifications.markRead`
- Admin CRUD wrappers gated by `private.has_role(uid,'admin')`

Public routes:
- `/api/public/webhooks/stripe` — verifies signature, handles `checkout.session.completed`, `invoice.paid`, `customer.subscription.updated/deleted`

Animations:
- `bun add lenis gsap` + a `<SmoothScroll>` provider in `__root.tsx` that excludes `/admin/*`
- GSAP ScrollTrigger registered once; reveal helper hook

## Out of scope this phase (parked for Phase 2+)
- bKash / Nagad / Rocket / Wise / Payoneer / SSLCommerz / manual bank transfer flows
- Blog module
- SEO admin panel + dynamic schema markup beyond per-route head()
- Support ticket system (notifications cover admin replies for now)
- Email templates admin
- Saved payment methods UI (Stripe Customer Portal link instead)
- Analytics dashboard widgets

## Order of execution
1. Migrations (schema, RLS, grants, storage buckets, seed plans & categories)
2. Enable Stripe (built-in)
3. Server functions + Stripe webhook route
4. Public marketplace pages + Lenis/GSAP
5. Checkout + dashboard + reviews + notifications
6. Admin CRUD extensions (services, packages, orders, memberships, coupons, team avatar)
7. Polish pass: animations, badges, empty states, loading skeletons

Approve and I'll start with the migration, then call `enable_stripe_payments`.