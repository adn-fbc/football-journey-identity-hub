import { Link } from "@tanstack/react-router";
import { Fingerprint, LogOut, Settings, ShieldCheck, UserRound } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CURRENT_USER } from "@/data/mock";
import { getRole } from "@/config/roles";
import { useRole } from "@/lib/role-context";
import { FootballIdTag } from "@/components/ds/football-id";
import { PersonAvatar } from "@/components/ds/avatars";

export function ProfileMenu() {
  const [profileOpen, setProfileOpen] = useState(false);
  const { role } = useRole();

  return (
    <>
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
          <DropdownMenuItem onSelect={() => setProfileOpen(true)}><UserRound /> Profile</DropdownMenuItem>
          <DropdownMenuItem asChild><Link to="/settings"><ShieldCheck /> Privacy & consent</Link></DropdownMenuItem>
          <DropdownMenuItem asChild><Link to="/settings"><Settings /> Settings</Link></DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => toast("Signed out (prototype)")}><LogOut /> Sign out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">Profile</DialogTitle>
            <DialogDescription>One account and Football ID across every role workspace.</DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-4">
            <PersonAvatar name={CURRENT_USER.name} size="lg" />
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">{CURRENT_USER.name}</div>
              <div className="truncate text-small text-muted-foreground">{CURRENT_USER.email}</div>
              <div className="mt-1 text-small text-muted-foreground">Current workspace: {getRole(role).label}</div>
            </div>
          </div>
          <FootballIdTag id={CURRENT_USER.footballId} />
        </DialogContent>
      </Dialog>
    </>
  );
}
