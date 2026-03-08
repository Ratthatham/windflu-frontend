import { User } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Button } from "@/components/ui/Button";
import { logout } from "@/app/(auth)/login/actions";
import { LogOut, User as UserIcon, Settings, Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/Input";

export function Header({ user }: { user: User }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-200/60 bg-white/80 backdrop-blur-md px-8">
      <div className="flex items-center gap-4 w-full max-w-sm">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search anything..."
            className="pl-10 h-9 bg-zinc-50 border-none focus-visible:ring-zinc-200 rounded-lg w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="text-zinc-500 hover:text-zinc-900"
        >
          <Bell className="h-5 w-5" />
        </Button>
        <div className="h-6 w-[1px] bg-zinc-200 mx-1" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative flex items-center gap-3 px-2 hover:bg-zinc-100/50 rounded-xl"
            >
              <div className="h-8 w-8 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-200 shadow-sm">
                <span className="text-xs font-semibold text-white">
                  {user.email?.[0].toUpperCase()}
                </span>
              </div>
              <div className="hidden md:flex flex-col items-start">
                <p className="text-xs font-semibold text-zinc-900 truncate max-w-[120px]">
                  {user.email?.split("@")[0]}
                </p>
                <p className="text-[10px] text-zinc-500">Pro Member</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 mt-2" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1 p-1">
                <p className="text-sm font-medium leading-none text-zinc-900">
                  {user.email}
                </p>
                <p className="text-xs leading-none text-zinc-500">
                  {user.role || "Personal Account"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <UserIcon className="mr-2 h-4 w-4 text-zinc-500" />
              <span>Profile Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4 text-zinc-500" />
              <span>Team Workspace</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <form action={logout}>
              <DropdownMenuItem asChild>
                <button
                  type="submit"
                  className="w-full h-full flex items-center text-red-600 focus:text-red-700 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </button>
              </DropdownMenuItem>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
