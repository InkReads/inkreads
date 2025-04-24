import HomeNavbar from '@/components/HomeNavbar';
import HomeSidebar from '@/components/HomeSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import useAuthStore from '@/store/authStore';

interface HomeLayoutProps {
  children: React.ReactNode;
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  const { user } = useAuthStore();

  return (
    <SidebarProvider>
      <div className="w-full">
        <HomeNavbar />
        <div className="flex min-h-screen pt-[4rem]">
          {/** user && <HomeSidebar /> **/}
          <main className="flex-1 overflow-y-hidden">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
