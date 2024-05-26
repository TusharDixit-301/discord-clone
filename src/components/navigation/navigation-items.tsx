'use client';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import ActionTooltip from '../action-tooltip';

interface NavigationItemsProps {
	id: string;
	name: string;
	imageUrl: string;
}

const NavigationItems = ({ id, name, imageUrl }: NavigationItemsProps) => {
	const params = useParams();
	const router = useRouter();
	const onClick = () => {
		router.push(`/servers/${id}`);
	};
	return (
		<ActionTooltip side="right" label={name} align="center">
			<button className="group relative flex items-center" onClick={onClick}>
				<div
					className={cn(
						'absolute left-0 bg-primary rounded-r-full transition-all w-[4px]',
						params?.serverId !== id && 'group-hover:h-[20px]',
						params?.serverId === id ? 'h-[36px]' : 'h-[8px]'
					)}
				/>
				<figure
					className={cn(
						'relative group flex mx-3 h-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden',
						params?.serverId === id &&
							'bg-primary/10 text-primary rounded-[16px] '
					)}
				>
					<Skeleton className="h-full w-full rounded-full" />
					<Image src={imageUrl} alt="channel" height={48} width={48} />
				</figure>
			</button>
		</ActionTooltip>
	);
};

export default NavigationItems;
