import InitialModal from '@/components/modals/Initial-Modal';
import { db } from '@/lib/db';
import { initialProfile } from '@/lib/initial-profile';
import { UserButton } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const SetupPage = async () => {
  const profile = await initialProfile();
  console.log('🚀 ~ SetupPage ~ profile:', profile);
  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });
  console.log('🚀 ~ SetupPage ~ server:', server);

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return (
    <>
      {/* <UserButton /> */}
      <InitialModal />
    </>
  );
};

export default SetupPage;
