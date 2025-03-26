import { ReactNode } from "react";
import Image from "next/image";
import { systemFonts } from "@/lib/fonts";

interface UserAuthLayout {
  children: ReactNode;
}

export default function AuthLayout({ children }: UserAuthLayout) {
  return (
    <div style={{ fontFamily: systemFonts.sans }} className="flex justify-center h-screen">
      <div className="flex flex-col items-center justify-center w-full max-w-md px-4">
        {children}
      </div>
    </div>
  );
}