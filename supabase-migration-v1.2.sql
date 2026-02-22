-- Migration v1.2: Add visibility column and update RLS policy
-- Run this in the Supabase SQL Editor for project wkghhgdmxgxyhaosugvf

ALTER TABLE interviews ADD COLUMN IF NOT EXISTS visibility text DEFAULT 'private';

DROP POLICY IF EXISTS "Users can view their own interviews" ON interviews;

CREATE POLICY "Users can view own or public interviews" ON interviews
  FOR SELECT USING (user_id = auth.uid() OR visibility = 'public');
