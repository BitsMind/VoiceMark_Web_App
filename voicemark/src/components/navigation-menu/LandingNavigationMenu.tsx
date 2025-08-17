import * as React from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import { Logo } from "../logo/Logo";

export function LandingNavMenu() {
  return (
    <div className="flex w-full items-center fixed border py-3 bg-gray-600 z-100">
      <div className="ml-4">
        <Logo />
      </div>
      <div className="ml-auto mr-4">
        <NavigationMenu viewport={false}>
          <NavigationMenuList>
            {/* Link to documentation */}
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={`${navigationMenuTriggerStyle()} bg-transparent`}
              >
                <Link href="/docs">Docs</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Link to About */}
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={`${navigationMenuTriggerStyle()} bg-transparent`}
              >
                <Link href="/docs">About</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Link to Help */}
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={`${navigationMenuTriggerStyle()} bg-transparent`}
              >
                <Link href="/docs">Help</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
}