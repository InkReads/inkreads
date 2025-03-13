import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";


export default function AuthActions() {
  const { user, username } = useAuth();

  const ProfileItems = [
    { name: "Profile", href:"/profile" },
    { name: "Settings", href:"/settings" },
    { name: "Sign out", href:"/logout-page" },
  ]

  return user ? (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <Avatar>
          <AvatarFallback className="text-black">{user.email?.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{username || user.email}</DropdownMenuLabel>
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
      <Button variant="default" asChild className="hidden sm:block"><Link href="/login-page">Login</Link></Button>
    </div>
  )
} 