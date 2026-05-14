-- 1. Make the old 'prayer_text' column optional so it stops causing errors
ALTER TABLE public.prayer_requests 
ALTER COLUMN prayer_text DROP NOT NULL;

-- 2. Make sure 'intent' is also ready
ALTER TABLE public.prayer_requests 
ALTER COLUMN intent DROP NOT NULL;

-- 3. Verify the Row Level Security (RLS) is still open for your requests
DROP POLICY IF EXISTS "Allow public insert" ON public.prayer_requests;
CREATE POLICY "Allow public insert" 
ON public.prayer_requests 
FOR INSERT 
WITH CHECK (true);