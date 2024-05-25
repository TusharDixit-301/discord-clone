import InitialModal from '@/components/modals/Initial-Modal';
import { db } from '@/lib/db';
import { initialProfile } from '@/lib/initial-profile';
import { redirect } from 'next/navigation';

const SetupPage = async () => {
	const profile = await initialProfile();
	const server = await db.server.findFirst({
		where: {
			members: {
				some: {
					id: profile.userId,
				},
			},
		},
	});

	if (server) {
		return redirect(`/servers/${server.id}`);
	}

	return <InitialModal />;
};

export default SetupPage;
