"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { CloudSun, MapPin, Search, Settings, Star } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type DashboardNavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
};

export const dashboardNavItems: DashboardNavItem[] = [
  {
    title: "Overview",
    href: "/",
    icon: CloudSun,
    description: "Quick snapshot of current weather",
  },
  {
    title: "Search City",
    href: "/search",
    icon: Search,
    description: "Search weather by city name",
  },
  {
    title: "Map",
    href: "/map",
    icon: MapPin,
    description: "Weather by location (Mapbox)",
  },
];

function isRouteActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SidebarNav({
  items = dashboardNavItems,
  onNavigate,
}: {
  items?: DashboardNavItem[];
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={150}>
      <nav className="flex flex-col gap-1">
        {items.map((item) => {
          const active = isRouteActive(pathname, item.href);
          const Icon = item.icon;

          return (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Button
                  asChild
                  variant={active ? "secondary" : "ghost"}
                  className={cn(
                    "h-10 justify-start gap-2 rounded-xl px-3",
                    active && "font-medium"
                  )}
                  onClick={onNavigate}
                >
                  <Link href={item.href}>
                    <Icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="hidden md:block">
                {item.description ?? item.title}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </nav>
    </TooltipProvider>
  );
}

export default function Sidebar() {
  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:border-r md:bg-background">
      <div className="sticky top-0 flex h-svh flex-col">
        <div className="flex h-14 items-center px-4">
          <Link href="/">
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl border">
                <CloudSun className="h-5 w-5" />
              </div>
              <div className="leading-tight">
                <p className="text-sm font-semibold">Weather Dashboard</p>
              </div>
            </div>
          </Link>
        </div>

        <Separator />

        <div className="flex-1 overflow-y-auto p-3">
          <SidebarNav />
        </div>
      </div>
    </aside>
  );
}
