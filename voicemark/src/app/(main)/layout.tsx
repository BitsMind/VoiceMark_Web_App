import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar/AppSidebar";
import DynamicBreadcrumb from "@/components/breadcrumb/breadcrumb";

import React from "react";
import { NavMenu } from "@/components/navigation-menu/NavigationMenu";
import { UserDropdown } from "@/components/user-dropdown-menu/UserDropdownMenu";
// import { cookies } from "next/headers";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const cookieStore = await cookies();
  // const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  return (
    <div className="flex h-full w-full">
      {/* <SidebarProvider defaultOpen={defaultOpen}> */}
        {/* <AppSidebar /> */}
        <main className="w-full">
          <div className="flex flex-row items-center">
            <NavMenu />
            <UserDropdown />
          </div>

          <div className="flex items-center pl-4">
            {/* <SidebarTrigger /> */}
            <DynamicBreadcrumb />
          </div>

          {children}
        </main>
      {/* </SidebarProvider> */}
    </div>
  );
}
