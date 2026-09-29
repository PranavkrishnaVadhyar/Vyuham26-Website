-- Run once in Supabase SQL Editor before starting the updated backend.
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS name varchar(120);
