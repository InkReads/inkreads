import HomeLayout from "@/layouts/home-layout";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <HomeLayout>
      {children}
    </HomeLayout>
  )
}