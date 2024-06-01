import NavigationSidebar from '@/components/navigation/navigation-sidebar';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="h-full">
      <article className="hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
        <NavigationSidebar />
      </article>
      <section className="md:pl-[72px] h-full">{children}</section>
    </main>
  );
}
