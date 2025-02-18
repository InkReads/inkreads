"use client"

import { HistoryIcon, ThumbsUpIcon, BookHeartIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

const items = [
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
]

export default function PersonalSection() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        Personal
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                asChild
                isActive={false}
                onClick={() => {}}
              >
                <Link href={item.url} className="flex items-center gap-4">
                  <item.icon />
                  <span className="text-sm">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}