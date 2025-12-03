-- 0003_add_business_schema.sql

-- 1. Business Categories
CREATE TABLE public.business_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for business_categories
ALTER TABLE public.business_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Business categories are viewable by everyone."
ON public.business_categories FOR SELECT
USING ( true );

-- Seed data for business_categories
INSERT INTO public.business_categories (name, slug) VALUES
('Makanan & Minuman', 'makanan-minuman'),
('Toko Kelontong', 'toko-kelontong'),
('Jasa', 'jasa'),
('Pakaian', 'pakaian'),
('Kesehatan', 'kesehatan'),
('Lainnya', 'lainnya');


-- 2. Businesses Table
CREATE TABLE public.businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.business_categories(id),
    name TEXT NOT NULL,
    owner_name TEXT NOT NULL,
    logo_url TEXT,
    address_text TEXT,
    latitude FLOAT8,
    longitude FLOAT8,
    keywords TEXT[],
    view_count INT DEFAULT 0,
    rating_avg FLOAT4 DEFAULT 0,
    rating_count INT DEFAULT 0,
    favorite_count INT DEFAULT 0,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add location as a PostGIS point for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;
ALTER TABLE public.businesses ADD COLUMN location GEOMETRY(Point, 4326);

-- Trigger to update location point
CREATE OR REPLACE FUNCTION update_business_location()
RETURNS TRIGGER AS $$
BEGIN
    NEW.location = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_business_location
BEFORE INSERT OR UPDATE ON public.businesses
FOR EACH ROW EXECUTE PROCEDURE update_business_location();

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON public.businesses
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();


-- RLS for businesses
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Businesses are viewable by everyone."
ON public.businesses FOR SELECT
USING ( true );

CREATE POLICY "Users can insert their own business."
ON public.businesses FOR INSERT
WITH CHECK ( auth.uid() = owner_id );

CREATE POLICY "Users can update their own business."
ON public.businesses FOR UPDATE
USING ( auth.uid() = owner_id );

CREATE POLICY "Users can delete their own business."
ON public.businesses FOR DELETE
USING ( auth.uid() = owner_id );


-- 3. Favorites Table
CREATE TABLE public.favorites (
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, business_id)
);

-- RLS for favorites
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own favorites."
ON public.favorites FOR SELECT
USING ( auth.uid() = user_id );

CREATE POLICY "Users can insert their own favorites."
ON public.favorites FOR INSERT
WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can delete their own favorites."
ON public.favorites FOR DELETE
USING ( auth.uid() = user_id );


-- 4. Functions to update counts

-- Function to update favorite_count on businesses table
CREATE OR REPLACE FUNCTION update_favorite_count()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE businesses SET favorite_count = favorite_count + 1 WHERE id = NEW.business_id;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE businesses SET favorite_count = favorite_count - 1 WHERE id = OLD.business_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for favorite_count
CREATE TRIGGER on_favorite_change
AFTER INSERT OR DELETE ON favorites
FOR EACH ROW EXECUTE PROCEDURE update_favorite_count();

-- Function to increment business view count
CREATE OR REPLACE FUNCTION increment_business_views(p_business_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.businesses
    SET view_count = view_count + 1
    WHERE id = p_business_id;
END;
$$ LANGUAGE plpgsql;


-- 5. Storage setup for business logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('business-logos', 'business-logos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Business logos are publicly accessible."
ON storage.objects FOR SELECT
USING ( bucket_id = 'business-logos' );

CREATE POLICY "Authenticated users can upload business logos."
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'business-logos' AND auth.role() = 'authenticated' );

CREATE POLICY "Business owners can update their own logo."
ON storage.objects FOR UPDATE
USING ( auth.uid() = owner )
WITH CHECK ( bucket_id = 'business-logos' );

CREATE POLICY "Business owners can delete their own logo."
ON storage.objects FOR DELETE
USING ( auth.uid() = owner );
