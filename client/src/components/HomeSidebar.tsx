import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { HomeIcon, FileHeart, FlameIcon, HistoryIcon, ThumbsUpIcon, BookHeartIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import useAuthStore from '@/store/authStore';

const MAIN_ITEMS = [
  {
    title: "Home",
    url: "/",
    icon: HomeIcon,
  },
  {
    title: "For You",
    url: "/",
    icon: FileHeart,
    auth: true,
  },
  {
    title: "Trending",
    url: "/",
    icon: FlameIcon,
  }
] as const;

const PERSONAL_ITEMS = [
  {
    title: "History",
    url: "/",
    icon: HistoryIcon,
    auth: true,
  },
  {
    title: "Liked stories",
    url: "/",
    icon: ThumbsUpIcon,
    auth: true,
  },
  {
    title: "Reading lists",
    url: "/",
    icon: BookHeartIcon,
    auth: true,
  }
] as const;

export default function HomeSidebar() {
  return (
    <Sidebar className="pt-16 z-40 border-r-4 border-gray-200">
      <SidebarContent className="bg-white font-semibold tracking-tight">
        <MainSection />
        <Separator className="border-gray-200 border-1" />
        <PersonalSection />
      </SidebarContent>
    </Sidebar>
  );
}

function MainSection() {
  return (
    <SidebarGroup>
    <SidebarGroupContent>
      <SidebarMenu>
        {MAIN_ITEMS.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              tooltip={item.title}
              asChild
              isActive={false}
              onClick={() => {}}
            >
              <Link to={item.url} className="flex items-center gap-4">
                <item.icon />
                <span className="text-sm">{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function PersonalSection() {
  const { user } = useAuthStore();

  return user ? (
    <SidebarGroup>
      <SidebarGroupLabel>
        Personal
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {PERSONAL_ITEMS.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                asChild
                isActive={false}
                onClick={() => {}}
              >
                <Link to={item.url} className="flex items-center gap-4">
                  <item.icon />
                  <span className="text-sm">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  ) : (
    null
  )
}