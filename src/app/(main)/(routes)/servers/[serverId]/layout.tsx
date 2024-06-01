import ServerSidebar from '@/components/server/server-sidebar';
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

async function ServerLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { serverId: string };
}>) {
  const profile = await currentProfile();
  if (!profile) {
    return auth().redirectToSignIn();
  }
  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (!server) {
    return redirect('/');
  }

  return (
    <main className="h-full">
      <article className="hidden md:flex h-full w-60 z-20 flex-col inset-y-0 fixed">
        <ServerSidebar serverId={params.serverId} />
      </article>
      <section className="h-full md:pl-60">{children}</section>
    </main>
  );
}

export default ServerLayout;
