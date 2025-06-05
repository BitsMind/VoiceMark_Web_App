import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar/AppSidebar";
import DynamicBreadcrumb from "@/components/breadcrumb/breadcrumb";

import React from "react";
import { NavMenu } from "@/components/navigation-menu/NavigationMenu";
import { UserDropdown } from "@/components/user-dropdown-menu/UserDropdownMenu";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-full w-full">
      <SidebarProvider>
        <AppSidebar />
        <main className=" w-full">
          <div className="flex flex-row items-center">
            <NavMenu />
            <UserDropdown />
          </div>

          <div className="flex items-center ">
            <SidebarTrigger />
            <DynamicBreadcrumb />
          </div>

          {children}
        </main>
      </SidebarProvider>
    </div>
  );
}
