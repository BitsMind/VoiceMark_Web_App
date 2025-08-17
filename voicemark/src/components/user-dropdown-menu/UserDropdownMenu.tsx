"use client";
import * as React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserStore } from "@/stores/user-store";
import { Menu, Settings, User } from "lucide-react";
import { useSignOutDialog } from "../alert/SignOutAlert";
import { useRouter } from "next/navigation";

export function UserDropdown() {
  const { currentUser } = useUserStore();
  const { show, Dialog } = useSignOutDialog();
  const router = useRouter();

  const userDisplayName = () => {
    if (!currentUser) return "";
    return currentUser.name;
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center mr-4 mt-4">
            <User size={20} />
            <p className="text-semibold text-primary text-sm truncate max-w-full overflow-hidden text-ellipsis mx-2">
              {userDisplayName()}
            </p>
            <Menu size={25} />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 mr-4" align="start">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => router.push("/profile")}>
              <User /> Account
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings/> Settings
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>GitHub</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuItem disabled>API</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={show}>
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {Dialog}
    </>
  );
}
