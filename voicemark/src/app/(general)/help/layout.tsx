import React from "react";
import { UserDropdown } from "@/components/user-dropdown-menu/UserDropdownMenu";
import { LandingNavMenu } from "@/components/navigation-menu/LandingNavigationMenu";


export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-full w-full">
        <main className="w-full">
          <div className="flex flex-row items-center">
            <LandingNavMenu />
            <UserDropdown />
          </div>

          {children}
        </main>
    </div>
  );
}
