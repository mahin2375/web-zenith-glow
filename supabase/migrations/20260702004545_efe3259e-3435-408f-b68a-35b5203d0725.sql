
-- 1. Profiles: allow users to insert their own row (defense in depth alongside the trigger)
DROP POLICY IF EXISTS "users insert own profile" ON public.profiles;
CREATE POLICY "users insert own profile" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- 2. has_role: ensure the public-schema variant is not callable by clients.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM authenticated;

-- 3. Storage: restrict owner read to files linked to an active order the user owns.
DROP POLICY IF EXISTS "order_attachments_owner_read" ON storage.objects;
CREATE POLICY "order_attachments_owner_read"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'order-attachments'
    AND (storage.foldername(name))[1] = auth.uid()::text
    AND EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id::text = (storage.foldername(name))[2]
        AND o.user_id = auth.uid()
        AND o.status <> 'cancelled'
    )
  );

-- 4. Coupons: drop the broad SELECT grant to authenticated. The admin_all
-- policy still lets admins read via RLS; regular users must go through
-- server-side validation instead of client-side lookups.
REVOKE SELECT ON public.coupons FROM authenticated;
