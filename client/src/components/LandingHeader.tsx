import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDownIcon } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const NAVIGATION_SECTIONS = [
  { "Community": ["Stories", "Authors", "Users"] },
  { "Browse": ["Novels", "Light Novels", "Comics", "Fanfiction"] },
] as const;

type MenuItem = 
  | { name: string; href: string }
  | { name: string; onClick: () => Promise<void> };

interface NavDropdownProps {
  section: typeof NAVIGATION_SECTIONS[number];
}

export default function LandingHeader() {
  const { user } = useAuthStore();

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 px-4 flex items-center z-50 font-dmSans text-white tracking-wider">
      <header className="w-full flex gap-8 items-center">
        {/* Logo Section */}
        <div className="flex items-center">
          <Link to="/">
            <span className="text-2xl">InkReads</span>
          </Link>
        </div>
      </header>

      {/* Navigation and Auth Section */}
      <section className="flex items-center">
        <div className="flex justify-between mx-2">
          {NAVIGATION_SECTIONS.map((section, index) => (
            <NavDropdown key={index} section={section} />
          ))}
        </div>
        {user ? <UserMenu /> : <AuthActions />}
      </section>
    </nav>
  );
}

function NavDropdown({ section }: NavDropdownProps) {
  const [title] = Object.keys(section);
  const items = Object.values(section)[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="focus:outline-none text-inherit hover:cursor-pointer">
        <div className="hidden lg:block items-center">
          <Button variant="ghost">
            {title}
            <ChevronDownIcon className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-[#f3f4f6] border-[#e5e7eb] shadow-md">
        <div className="flex flex-col">
          {items.map((item: string, index: number) => (
            <Button 
              variant="link" 
              asChild 
              key={index}
              className="px-4 hover:bg-muted"
            >
              <Link to={`/genres/${item.toLowerCase().replace(" ", "")}`}>
                {item}
              </Link>
            </Button>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function UserMenu() {
  const { userData, setUser } = useAuthStore();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate('/landing');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const menuItems: MenuItem[] = [
    { name: "Profile", href: `/profile/${userData?.username}` },
    { name: "Settings", href: "/settings" },
    { name: "Sign out", onClick: handleSignOut },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="hover:cursor-pointer">
        <Avatar>
          <AvatarFallback>
            {userData?.username?.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-[#f3f4f6] border-[#e5e7eb] shadow-md">
        <DropdownMenuLabel className="font-bold">
          {userData?.username}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="w-full ml-0 bg-gray-300"/>
        <section className="flex flex-col items-start">
          {menuItems.map((item, index) => (
            <Button 
              variant="link" 
              key={index}
              onClick={'onClick' in item ? item.onClick : undefined}
              asChild={'href' in item}
            >
              {'onClick' in item ? (
                item.name
              ) : (
                <Link to={item.href}>{item.name}</Link>
              )}
            </Button>
          ))}
        </section>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AuthActions() {
  return (
    <div className="flex gap-2">
      <Button variant="link" asChild className="hidden sm:block">
        <Link to="/login">Login</Link>
      </Button>
      <Button variant="default" asChild className="hidden sm:block bg-blue-600 hover:bg-blue-500 text-white">
        <Link to="/signup">Sign Up</Link>
      </Button>
    </div>
  );
}
