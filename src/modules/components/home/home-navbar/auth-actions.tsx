import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/modules/context/auth-context";
import Link from "next/link";


export default function AuthActions() {
  const { user } = useAuth();

  const ProfileItems = [
    { name: "Profile", href:"/profile" },
    { name: "Settings", href:"/settings" },
    { name: "Sign out", href:"/logout-page" },
  ]

  return user ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <Avatar>
          <AvatarFallback>{user.email?.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
        <DropdownMenuSeparator className="w-full ml-0 bg-gray-300"/>
        <section className="flex flex-col items-start">
          {ProfileItems.map((item, key) => (
            <Button variant="link" asChild key={key}>
              <Link href={item.href}>{item.name}</Link>
            </Button>
          ))}
        </section>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <div className="flex gap-2">
      <Button variant="link" asChild className="hidden sm:block"><Link href="/login-page">Login</Link></Button>
      <Button variant="default" asChild className="hidden sm:block"><Link href="/signup-page">Sign up </Link></Button>
    </div>
  )
} 