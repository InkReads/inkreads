import HomeNavbar from '@/components/HomeNavbar';
import { SidebarProvider } from '@/components/ui/sidebar';

interface HomeLayoutProps {
  children: React.ReactNode;
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <SidebarProvider>

      <div className="w-full bg-background text-foreground">
        <HomeNavbar />
        <div className="flex min-h-screen pt-[4rem]">
          <main className="flex-1">

            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
