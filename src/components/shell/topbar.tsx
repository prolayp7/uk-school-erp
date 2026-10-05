"use client";

import { Bell, CalendarDays, ChevronDown, HelpCircle, LogOut, Menu, Search } from "lucide-react";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

export type TopbarUser = {
  name: string;
  role: string;
  initials: string;
};

export function Topbar({
  user,
  academicYear,
  academicTerm,
  onOpenNav,
}: {
  user: TopbarUser;
  academicYear: string;
  academicTerm: string;
  onOpenNav: () => void;
}) {
  const router = useRouter();

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login?reason=signed_out");
    router.refresh();
  }

  return (
    <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between gap-4 border-b border-border bg-card/90 px-4 backdrop-blur-md lg:left-64 lg:px-6">
      <div className="flex max-w-xl flex-1 items-center gap-3">
        <button
          type="button"
          onClick={onOpenNav}
          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="relative hidden w-full items-center sm:flex">
          <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search pupils, staff, UPN, admission no…"
            className="h-9 border-0 bg-muted pl-9 pr-14 focus-visible:bg-card"
          />
          <kbd className="pointer-events-none absolute right-2.5 rounded border border-border bg-card px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground shadow-sm">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex flex-shrink-0 items-center gap-1.5 sm:gap-3">
        {academicYear ? (
          <div className="hidden items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1.5 text-sm font-medium text-foreground md:flex">
            <CalendarDays className="h-[18px] w-[18px] text-muted-foreground" />
            <span>{academicYear}{academicTerm ? ` (${academicTerm})` : ""}</span>
          </div>
        ) : null}
        <button
          type="button"
          className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand ring-2 ring-card" />
        </button>
        <button
          type="button"
          className="hidden rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:inline-flex"
          aria-label="Help"
        >
          <HelpCircle className="h-5 w-5" />
        </button>
        <div className="mx-1 hidden h-6 w-px bg-border sm:block" />
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2.5 rounded-lg py-1 pl-1 pr-1 outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Avatar>
              <AvatarFallback className="bg-brand text-white">{user.initials}</AvatarFallback>
            </Avatar>
            <div className="hidden flex-col text-left leading-tight lg:flex">
              <span className="text-sm font-medium text-foreground">{user.name}</span>
              <span className="text-[11px] text-muted-foreground">{user.role}</span>
            </div>
            <ChevronDown className="hidden h-4 w-4 text-muted-foreground lg:block" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <span className="block font-medium text-foreground">{user.name}</span>
              <span className="block text-xs font-normal text-muted-foreground">{user.role}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile & security</DropdownMenuItem>
            <DropdownMenuItem>Notification settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault();
                void signOut();
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
