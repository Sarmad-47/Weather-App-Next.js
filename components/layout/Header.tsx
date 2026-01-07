"use client";

import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SidebarNav } from "./Sidebar";
import ModeToggle from "./mode-toggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center gap-3 px-4 md:px-6">
        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0">
            <SheetHeader className="px-4 py-4">
              <SheetTitle>Weather Dashboard</SheetTitle>
            </SheetHeader>
            <Separator />
            <div className="p-3">
              <SidebarNav onNavigate={() => {}} />
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex-1  " />

        {/* Theme toggle */}
        <div className="mr-10 md:mr-10">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
