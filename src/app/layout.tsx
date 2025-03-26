import type { Metadata } from "next";
import "./globals.css";
import { systemFonts } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "InkReads",
  description: "Your next favorite book awaits.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: systemFonts.sans }}>
        {children}
      </body>
    </html>
  );
}
