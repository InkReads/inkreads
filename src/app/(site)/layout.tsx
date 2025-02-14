import HomeLayout from "@/modules/layouts/home-layout";

interface HomeLayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: HomeLayoutProps) {
  return (
    <HomeLayout>
      {children}
    </HomeLayout>
  )
}