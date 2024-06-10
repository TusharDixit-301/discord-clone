import NavigationSidebar from '@/components/navigation/navigation-sidebar';
import { Menu } from 'lucide-react';
import ServerSidebar from './server/server-sidebar';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
const MobileToggle = ({ serverId }: { serverId: string }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size={'icon'} className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side={'left'} className="p-0 flex gap-0">
        <div className="w-[72px]">
          <NavigationSidebar />
        </div>
        <ServerSidebar serverId={serverId} />
      </SheetContent>
    </Sheet>
  );
};

export default MobileToggle;
