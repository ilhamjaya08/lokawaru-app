'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

interface CreateBusinessArgs {
  category_id: string;
  name: string;
  owner_name: string;
  logo: File;
  address_text: string;
  latitude: number;
  longitude: number;
  keywords?: string[];
}

export async function createBusiness(args: CreateBusinessArgs) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Authentication required' };
  }

  // 1. Upload logo to storage
  const logoFile = args.logo;
  const fileExt = logoFile.name.split('.').pop();
  const fileName = `${user.id}/${Date.now()}.${fileExt}`;
  const { error: uploadError } = await supabase.storage
    .from('business-logos')
    .upload(fileName, logoFile);

  if (uploadError) {
    console.error('Error uploading logo:', uploadError);
    return { success: false, error: 'Failed to upload logo' };
  }

  // 2. Get public URL for the logo
  const { data: { publicUrl } } = supabase.storage
    .from('business-logos')
    .getPublicUrl(fileName);

  // 3. Insert business data into the database
  const { data: business, error: insertError } = await supabase
    .from('businesses')
    .insert({
      owner_id: user.id,
      category_id: args.category_id,
      name: args.name,
      owner_name: args.owner_name,
      logo_url: publicUrl,
      address_text: args.address_text,
      latitude: args.latitude,
      longitude: args.longitude,
      keywords: args.keywords,
    })
    .select('id')
    .single();

  if (insertError) {
    console.error('Error creating business:', insertError);
    // Attempt to delete the uploaded file if db insert fails
    await supabase.storage.from('business-logos').remove([fileName]);
    return { success: false, error: 'Failed to save business data' };
  }

  // Revalidate paths to show the new business immediately
  revalidatePath('/');
  revalidatePath('/dashboard');

  return { success: true, businessId: business.id };
}
