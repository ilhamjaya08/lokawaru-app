import { createClient as createServerClient } from '@/lib/supabase/server';
import type { FullUser } from '@/lib/types/user';

export async function getFullUser(): Promise<FullUser | null> {
  const supabase = createServerClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) {
    return null;
  }

  const { data: publicUser, error } = await supabase
    .from('users')
    .select('roles, bio')
    .eq('id', authUser.id)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching public user:', error);
    return null;
  }

  return {
    id: authUser.id,
    email: authUser.email || '',
    displayName: authUser.user_metadata?.display_name || authUser.email?.split('@')[0] || 'User',
    phone: authUser.phone || null,
    roles: publicUser?.roles || ['user'],
    bio: publicUser?.bio || null,
    createdAt: authUser.created_at,
  };
}
