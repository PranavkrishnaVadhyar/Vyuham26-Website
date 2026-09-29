-- First create the Auth user in Supabase Dashboard → Authentication → Users.
-- Replace the email below, then run this statement in Supabase SQL Editor.
-- It creates or updates only that user's profile row and grants the admin role.
INSERT INTO public.profiles (id, email, name, phone, role)
SELECT id,
       email,
       COALESCE(raw_user_meta_data ->> 'full_name', raw_user_meta_data ->> 'name'),
       raw_user_meta_data ->> 'phone',
       'admin'::public.user_role
FROM auth.users
WHERE lower(email) = lower('admin@example.com')
ON CONFLICT (id) DO UPDATE
SET email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, public.profiles.name),
    phone = COALESCE(EXCLUDED.phone, public.profiles.phone),
    role = 'admin'::public.user_role;