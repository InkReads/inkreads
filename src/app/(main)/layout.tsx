import MainLayout from "@/layouts/main-layout";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <MainLayout>
      {children}
    </MainLayout>
  )
}