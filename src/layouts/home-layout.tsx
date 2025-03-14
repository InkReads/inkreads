import { SidebarProvider } from "@/components/ui/sidebar";
import HomeNavbar from "@/components/home/home-navbar/home-navbar";
import HomeSidebar from "@/components/home/home-sidebar/home-sidebar";
import { AuthProvider } from "../context/auth-context";

interface HomeLayoutProps {
  children: React.ReactNode;
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <div className="w-full">
          <HomeNavbar />
          <div className="flex min-h-screen pt-[4rem]">
            <HomeSidebar />
            <main className="flex-1 overflow-y-hidden">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </AuthProvider>
  )
}