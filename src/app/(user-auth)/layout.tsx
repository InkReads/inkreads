import UserAuthLayout from "@/layouts/uauth-layout";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <UserAuthLayout>
      {children}
    </UserAuthLayout>
  )
}