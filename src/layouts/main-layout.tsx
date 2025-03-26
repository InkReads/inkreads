"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import HomeNavbar from "@/components/home/home-navbar/home-navbar";
import HomeSidebar from "@/components/home/home-sidebar/home-sidebar";
import { AuthProvider, useAuth } from "../context/auth-context";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { user } = useAuth();

  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}