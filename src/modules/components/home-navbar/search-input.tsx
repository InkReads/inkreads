import { Input } from "@/components/ui/input"
import { SearchIcon } from "lucide-react"

export default function SearchInput() {
  // TODO: Add search functionality
  return (
    <form className="flex relative w-full max-w-sm items-center gap-1.5">
      <div className="absolute left-2.5 top-2 text-muted-foreground">
        <SearchIcon />
      </div>
      <Input placeholder="Search..." className="sm:w-[16rem] lg:w-[20rem] h-10 shadow-none pl-10" onClick={()=>{}}/>
    </form>
  )
}