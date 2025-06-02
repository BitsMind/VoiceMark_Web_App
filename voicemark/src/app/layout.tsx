"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar.tsx/AppSidebar";
import DynamicBreadcrumb from "@/components/breadcrumb/breadcrumb";

import React, { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";
import { NavMenu } from "@/components/navigation-menu/NavigationMenu";
// import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex h-full w-full">
          <SidebarProvider>
            <AppSidebar />
            <main className=" w-full">
              <NavMenu />
              <div className="flex "> TODO: FIX THE ALIGNMENT OF THE ICON
                <SidebarTrigger />
                <DynamicBreadcrumb />
              </div>

              {children}
            </main>
          </SidebarProvider>

          {/* <Toaster position="top-center" /> */}
        </div>
      </body>
    </html>
  );
}
