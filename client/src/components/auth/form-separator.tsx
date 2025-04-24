import { Separator } from '@/components/ui/separator';

export default function FormSeparator() {
  return (
    <div className="flex justify-center items-center gap-2 mt-3 w-[47.5%]">
      <Separator className="w-[10%] border-gray-400 border-[0.5px]" />
      <span className="text-lg text-muted-foreground">or</span>
      <Separator className="w-[10%] border-gray-400 border-[0.5px]" />
    </div>
  )
}