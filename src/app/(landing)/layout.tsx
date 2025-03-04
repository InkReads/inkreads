import LandingLayout from "@/modules/layouts/landing-layout";

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