'use client';

import { createClient } from '@/lib/supabase/client';
import type { Business, BusinessCategory, BusinessWithCategory } from '@/lib/types/business';

const supabase = createClient();

export async function getCategories(): Promise<BusinessCategory[]> {
  const { data, error } = await supabase.from('business_categories').select('*').order('name');
  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  return data;
}

export async function getBusinessById(id: string): Promise<BusinessWithCategory | null> {
  const { data, error } = await supabase
    .from('businesses')
    .select('*, category:business_categories(*)')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching business by id:', error);
    return null;
  }
  
  // The query returns `business_categories` as the table name, but we want it as `category`
  const { business_categories, ...rest } = data;
  return { ...rest, category: business_categories as BusinessCategory };
}

export async function getMyBusinesses(): Promise<Business[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching user businesses:', error);
        return [];
    }
    return data;
}


export async function incrementBusinessViews(id: string): Promise<void> {
    const { error } = await supabase.rpc('increment_business_views', { p_business_id: id });
    if (error) {
        console.error('Error incrementing business views:', error);
    }
}
