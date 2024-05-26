import NavigationAction from '@/components/navigation/navigation-action';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import NavigationItems from './navigation-items';
import { UserButton } from '@clerk/nextjs';
import { ModeToggle } from '@/components/mode-toggle';

const NavigationSidebar = async () => {
	const profile = await currentProfile();
	if (!profile) return redirect('/');
	const servers = await db.server.findMany({
		where: {
			members: {
				some: {
					profileId: profile.id,
				},
			},
		},
	});
	return (
		<main className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22]">
			<NavigationAction />
			<Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
			<ScrollArea className="flex-1 w-full">
				{servers.map((server) => (
					<article key={server.id} className="mb-4">
						<NavigationItems
							id={server.id}
							imageUrl={server.imageUrl}
							name={server.name}
						/>
					</article>
				))}
			</ScrollArea>
			<section className="pb-3 mt-auto flex items-center flex-col gap-y-4">
				<ModeToggle />
				<UserButton afterSignOutUrl='/' appearance={
					{
						elements:{
							avatarBox : "h-[48px] w-[48px] ",
						}
					}
				}	/>
			</section>
		</main>
	);
};

export default NavigationSidebar;
