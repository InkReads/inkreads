import { AuthProvider } from "../context/auth-context";

interface LandingLayoutProps {
  children: React.ReactNode;
}

export default function LandingLayout({ children }: LandingLayoutProps) {
  return (
    <AuthProvider>
      <main className="w-full min-h-screen overflow-y-hidden">
        {children}
      </main>
    </AuthProvider>
  )
}