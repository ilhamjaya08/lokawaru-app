import { createClient as createBrowserClient } from '@/lib/supabase/client';

export async function updateProfile(updates: {
  displayName: string;
  phone?: string;
  bio?: string;
}) {
  const supabase = createBrowserClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'User not authenticated' };
  }

  const { displayName, phone, bio } = updates;

  const { error: authError } = await supabase.auth.updateUser({
    data: { display_name: displayName },
    phone: phone,
  });

  if (authError) {
    return { success: false, error: authError.message };
  }

  const { error: publicError } = await supabase
    .from('users')
    .update({ bio: bio })
    .eq('id', user.id);

  if (publicError) {
    return { success: false, error: publicError.message };
  }

  return { success: true };
}