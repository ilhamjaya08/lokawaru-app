'use client';

import { createClient } from '@/lib/supabase/client';
import type { BusinessWithCategory } from '@/lib/types/business';

const supabase = createClient();

export async function isFavorited(business_id: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data, error } = await supabase
    .from('favorites')
    .select('business_id')
    .eq('user_id', user.id)
    .eq('business_id', business_id)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
    console.error('Error checking favorite status:', error);
  }

  return !!data;
}

export async function addFavorite(business_id: string): Promise<{ success: boolean; error?: string }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'User not authenticated' };

  const { error } = await supabase
    .from('favorites')
    .insert({ user_id: user.id, business_id });

  if (error) {
    console.error('Error adding favorite:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function removeFavorite(business_id: string): Promise<{ success: boolean; error?: string }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'User not authenticated' };

  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', user.id)
    .eq('business_id', business_id);

  if (error) {
    console.error('Error removing favorite:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function getFavorites(): Promise<BusinessWithCategory[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
        .from('favorites')
        .select('business:businesses(*, category:business_categories(*))')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching favorites:', error);
        return [];
    }

    return data.map(fav => {
        const { business_categories, ...rest } = fav.business;
        return { ...rest, category: business_categories };
    });
}
