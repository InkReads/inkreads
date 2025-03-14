import { Separator } from "@/components/ui/separator";

export default function FormSeparator() {
  return (
    <div className="flex justify-center items-center gap-2 mt-3 w-full">
      <Separator className="w-[46.5%]" />
      <span className="text-lg text-muted-foreground">or</span>
      <Separator className="w-[46.5%]" />
    </div>
  )
}