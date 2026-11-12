import { Link } from "@tanstack/react-router";
import { Fingerprint, LogOut, Settings, ShieldCheck, UserRound } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CURRENT_USER } from "@/data/mock";
import { PersonAvatar } from "@/components/ds/avatars";

export function ProfileMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="Open profile menu">
          <PersonAvatar name={CURRENT_USER.name} size="sm" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="font-normal">
          <div className="text-sm font-semibold">{CURRENT_USER.name}</div>
          <div className="text-small text-muted-foreground">{CURRENT_USER.email}</div>
          <div className="mt-1 text-id text-muted-foreground">{CURRENT_USER.footballId}</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild><Link to="/football-id"><Fingerprint /> My Football ID</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link to="/settings"><UserRound /> Account</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link to="/settings"><ShieldCheck /> Privacy & consent</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link to="/settings"><Settings /> Settings</Link></DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => toast("Signed out (prototype)")}><LogOut /> Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
