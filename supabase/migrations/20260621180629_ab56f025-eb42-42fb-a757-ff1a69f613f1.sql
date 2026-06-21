
CREATE POLICY "order_attachments_owner_read"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'order-attachments' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "order_attachments_owner_write"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'order-attachments' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "order_attachments_owner_update"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'order-attachments' AND (storage.foldername(name))[1] = auth.uid()::text)
  WITH CHECK (bucket_id = 'order-attachments' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "order_attachments_owner_delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'order-attachments' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "order_attachments_admin_all"
  ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'order-attachments' AND private.has_role(auth.uid(),'admin'))
  WITH CHECK (bucket_id = 'order-attachments' AND private.has_role(auth.uid(),'admin'));
