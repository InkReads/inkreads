"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import HomeNavbar from "@/components/home/home-navbar/home-navbar";
import HomeSidebar from "@/components/home/home-sidebar/home-sidebar";
import { AuthProvider, useAuth } from "../context/auth-context";

interface HomeLayoutProps {
  children: React.ReactNode;
}

function HomeLayoutContent({ children }: HomeLayoutProps) {
  const { user } = useAuth();

  return (
    <SidebarProvider>
      <div className="w-full">
        <HomeNavbar />
        <div className="flex min-h-screen pt-[4rem]">
          {user && <HomeSidebar />}
          <main className="flex-1 overflow-y-hidden">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <AuthProvider>
      <HomeLayoutContent>
        {children}
      </HomeLayoutContent>
    </AuthProvider>
  );
}