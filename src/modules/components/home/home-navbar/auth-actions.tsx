import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
          <AvatarImage src="https://github.com/shadcn.png" alt="avatar" />
          <AvatarFallback>EX</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="">
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
    <div className="flex">
      <Button variant="link" asChild className="hidden sm:block"><Link href="/login-page">LOGIN</Link></Button>
      <Button variant="link" asChild className="hidden sm:block"><Link href="/signup-page">SIGN UP </Link></Button>
    </div>
  )
} 