"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar";
import { Home, Bot, Users, Settings, Zap, Plus } from "lucide-react";
import { ReactNode, useState } from "react";
import { WebinarModal } from "./WebinarModal";
import { motion as m } from "framer-motion";

export function AppShell({ children, title = "Home" }: { children: ReactNode; title?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const items = [
    { href: "/", label: "Home", icon: Home },
    { href: "/ai-agents", label: "AI-Agents", icon: Bot },
    { href: "/lead", label: "Lead", icon: Users },
  ];

  return (
    <SidebarProvider>
      <Sidebar className="bg-black text-white border-r border-white/10">
        <SidebarHeader className="px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            {/* Smartcast Professional Logo */}
            <m.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="h-9 w-9 grid place-items-center rounded-md bg-transparent"
            >
              <svg viewBox="0 0 64 64" className="h-9 w-9" aria-label="Smartcast logo" role="img">
                <defs>
                  <linearGradient id="sc-g" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
                <rect x="4" y="4" width="56" height="56" rx="14" fill="#0b0b0b" stroke="url(#sc-g)" strokeWidth="2" />
                <polygon points="26,20 46,32 26,44" fill="url(#sc-g)" />
                <path d="M18 24c6-6 12-6 18 0" stroke="url(#sc-g)" strokeWidth="2" fill="none" strokeLinecap="round" />
                <path d="M18 32c6-6 12-6 18 0" stroke="url(#sc-g)" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" />
                <path d="M18 40c6-6 12-6 18 0" stroke="url(#sc-g)" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.45" />
              </svg>
            </m.div>
            <div className="leading-tight">
              <div className="text-base font-semibold tracking-tight">Smartcast</div>
              <div className="text-[10px] text-white/60 uppercase tracking-wider">Webinars</div>
            </div>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs text-white/50">Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((it) => (
                  <SidebarMenuItem key={it.href}>
                    <SidebarMenuButton asChild className={`justify-start ${pathname === it.href ? "bg-white/10" : "hover:bg-white/5"}`}>
                      <Link href={it.href}>
                        <it.icon className="mr-2 h-4 w-4" />
                        <span>{it.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="p-4">
          <div className="text-xs text-white/40">v1.0.0</div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="sticky top-0 z-10 w-full border-b border-white/10 bg-black/80 backdrop-blur supports-[backdrop-filter]:bg-black/70">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
            <div className="text-sm rounded-full border border-white/10 px-3 py-1 text-white/70">{title}</div>
            <div className="flex items-center gap-2">
              <m.div whileTap={{ scale: 0.95 }}>
                <Button size="sm" className="bg-violet-600 hover:bg-violet-500">
                  <Zap className="mr-2 h-4 w-4" />
                  Boost
                </Button>
              </m.div>
              <m.div whileTap={{ scale: 0.95 }}>
                <Button size="sm" variant="secondary" className="rounded-full bg-white/10 hover:bg-white/20 text-white border-white/10" onClick={() => setOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Create Webinar
                </Button>
              </m.div>
            </div>
          </div>
        </div>
        <div className="mx-auto w-full max-w-7xl px-6 py-8">{children}</div>
      </SidebarInset>
      <WebinarModal open={open} onOpenChange={setOpen} />
    </SidebarProvider>
  );
}