import { redirect } from 'next/navigation';
import { getFullUser } from '@/lib/services/user.server';
import ProfileClientPage from './ProfileClientPage';

export default async function ProfilePage() {
  const user = await getFullUser();

  if (!user) {
    redirect('/signin');
  }

  return <ProfileClientPage user={user} />;
}
