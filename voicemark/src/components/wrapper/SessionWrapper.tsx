"use client";

import { useEffect } from "react";
import { useUserStore } from "@/stores/user-store";
import { getMe } from "@/actions/auth";
import { usePathname } from "next/navigation";

export default function SessionWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setCurrentUser, currentUser } = useUserStore();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.includes("/login")) {
      return;
    }

    (async () => {
      if (!currentUser) {
        const res = await getMe();
        setCurrentUser(res);
      }
    })();
  }, []);

  return <>{children}</>;
}
