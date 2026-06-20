DROP POLICY IF EXISTS "anyone submits contact" ON public.contact_messages;
CREATE POLICY "anyone submits contact" ON public.contact_messages
FOR INSERT TO anon, authenticated
WITH CHECK (
  name IS NOT NULL AND length(name) BETWEEN 1 AND 100
  AND email IS NOT NULL AND length(email) BETWEEN 3 AND 255
  AND message IS NOT NULL AND length(message) BETWEEN 1 AND 5000
  AND notes IS NULL
  AND status = 'new'
);