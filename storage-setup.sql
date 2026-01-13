-- Create documents storage bucket for file uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents', 
  'documents', 
  true, 
  10485760, -- 10MB
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
) ON CONFLICT (id) DO NOTHING;

-- Set up Row Level Security (RLS) policies
-- Allow authenticated users to upload their own documents
CREATE POLICY "Users can upload their own documents" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'documents' AND 
  auth.role() = 'authenticated' AND 
  (storage.foldername(name))[1]::text = auth.uid()::text
);

-- Allow users to read their own documents
CREATE POLICY "Users can read their own documents" ON storage.objects
FOR SELECT USING (
  bucket_id = 'documents' AND 
  auth.role() = 'authenticated' AND 
  (storage.foldername(name))[1]::text = auth.uid()::text
);

-- Allow users to update their own documents
CREATE POLICY "Users can update their own documents" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'documents' AND 
  auth.role() = 'authenticated' AND 
  (storage.foldername(name))[1]::text = auth.uid()::text
);

-- Allow users to delete their own documents
CREATE POLICY "Users can delete their own documents" ON storage.objects
FOR DELETE USING (
  bucket_id = 'documents' AND 
  auth.role() = 'authenticated' AND 
  (storage.foldername(name))[1]::text = auth.uid()::text
);

-- Allow service role to bypass RLS for admin operations
CREATE POLICY "Service role can manage all documents" ON storage.objects
FOR ALL USING (
  bucket_id = 'documents' AND 
  auth.role() = 'service_role'
);
