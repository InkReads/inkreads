import UserAuthLayout from "@/layouts/auth-layout";

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