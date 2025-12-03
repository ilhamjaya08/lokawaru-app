export interface BusinessCategory {
  id: string;
  name: string;
  slug: string;
}

export interface Business {
  id: string;
  owner_id: string;
  category_id: string;
  name: string;
  owner_name: string;
  logo_url: string;
  address_text: string;
  latitude: number;
  longitude: number;
  keywords?: string[];
  view_count: number;
  rating_avg: number;
  rating_count: number;
  favorite_count: number;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface BusinessWithCategory extends Business {
  category: BusinessCategory;
}

export interface LocationCoordinates {
  lat: number;
  lng: number;
}
