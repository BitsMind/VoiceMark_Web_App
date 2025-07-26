import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

import React, { PropsWithChildren } from "react";
import { Metadata } from "next";
import SessionWrapper from "@/components/wrapper/SessionWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VoiceMark",
  description: "Audio-watermarkinng made easy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-b from-[#2c3e50] to-[#fd746c]`}
      >
        <SessionWrapper>
          <main className="w-full">{children}</main>
        </SessionWrapper>
        <Toaster position="top-center" />
        <div className="sm:hidden fixed inset-0 z-50 bg-black text-white flex items-center justify-center text-center p-6">
          <p className="text-lg font-semibold">
            This application is best experienced on a laptop or desktop device.
            <br />
            Please switch to a larger screen.
          </p>
        </div>
      </body>
    </html>
  );
}
