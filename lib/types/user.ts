import type { User } from '@supabase/supabase-js';

export type FullUser = {
  id: string;
  email: string;
  displayName: string;
  phone: string | null;
  roles: string[];
  bio: string | null;
  createdAt: string;
};
