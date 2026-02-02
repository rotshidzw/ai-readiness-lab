import "./globals.css";
import type { Metadata } from "next";
import { TrpcProvider } from "@/components/trpc-provider";
import { ActivityProvider } from "@/components/activity-provider";

export const metadata: Metadata = {
  title: "LUMINA AI Studio",
  description: "Portfolio-grade AI learning, prompt lab, and automation playground.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TrpcProvider>
          <ActivityProvider>{children}</ActivityProvider>
        </TrpcProvider>
      </body>
    </html>
  );
}
