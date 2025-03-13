import { Sidebar, SidebarContent } from "@/components/ui/sidebar"
import PersonalSection from "./personal-section"
import { Separator } from "@/components/ui/separator"
import MainSection from "./main-section"

export default function HomeSidebar() {
  return (
    <Sidebar className="pt-16 z-40 border-r-1">
      <SidebarContent className="bg-background font-semibold tracking-tight">
        <MainSection />
        <Separator />
        <PersonalSection />
      </SidebarContent>
    </Sidebar>
  )
}