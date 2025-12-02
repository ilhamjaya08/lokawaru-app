-- Create public.users table
CREATE TABLE public.users (
    id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    roles TEXT[] DEFAULT '{user}',
    bio VARCHAR(200),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (id)
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- POLICIES
-- 1. Allow public read access
CREATE POLICY "Public users are viewable by everyone."
ON public.users FOR SELECT
USING ( true );

-- 2. Allow individual user to insert their own data
CREATE POLICY "Users can insert their own user data."
ON public.users FOR INSERT
WITH CHECK ( auth.uid() = id );

-- 3. Allow individual user to update their own data
CREATE POLICY "Users can update their own user data."
ON public.users FOR UPDATE
USING ( auth.uid() = id );

-- TRIGGER
-- This trigger automatically creates a user entry in public.users when a new user signs up in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id)
  VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Set up Storage!
-- This is a generic setup for user-specific buckets.
-- You might want to adjust this based on your needs.

-- 1. Create a bucket for user avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Add RLS policies for avatars bucket
CREATE POLICY "Avatar images are publicly accessible."
ON storage.objects FOR SELECT
USING ( bucket_id = 'avatars' );

CREATE POLICY "Anyone can upload an avatar."
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'avatars' );

CREATE POLICY "Users can update their own avatar."
ON storage.objects FOR UPDATE
USING ( auth.uid() = owner )
WITH CHECK ( bucket_id = 'avatars' );

CREATE POLICY "Users can delete their own avatar."
ON storage.objects FOR DELETE
USING ( auth.uid() = owner );
