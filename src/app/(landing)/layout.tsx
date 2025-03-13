import LandingLayout from "@/layouts/landing-layout";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <LandingLayout>
      {children}
    </LandingLayout>
  )
}