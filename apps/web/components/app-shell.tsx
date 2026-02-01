"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ActivityConsole } from "@/components/activity-console";
import { useActivity } from "@/components/activity-provider";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/learning", label: "Learning Hub" },
  { href: "/prompt-lab", label: "Prompt Lab" },
  { href: "/automations", label: "Automations" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { addLog } = useActivity();

  React.useEffect(() => {
    addLog({ eventType: "NAVIGATION", message: `Navigated to ${pathname}` });
  }, [pathname, addLog]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-sky-300">Lumina</p>
            <h1 className="text-lg font-semibold">AI Studio</h1>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-white/70 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Button
            variant="outline"
            onClick={() => addLog({ eventType: "CLICK", message: "Demo mode toggled" })}
          >
            Demo mode
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-24 pt-10 md:pr-[28rem]">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>
      <ActivityConsole />
    </div>
  );
}
