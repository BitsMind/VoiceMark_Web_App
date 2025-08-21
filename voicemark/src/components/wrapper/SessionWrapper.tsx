"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUserStore } from "@/stores/user-store";
import { getMe } from "@/api/auth";

const SKIPPED_ROUTES = ["/landing", "/login", "/signup", "/help"];

export default function SessionWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, setCurrentUser } = useUserStore();
  const [checked, setChecked] = useState(false);

  const shouldSkip = SKIPPED_ROUTES.includes(pathname);

  useEffect(() => {
    if (shouldSkip) {
      setChecked(true);
      return;
    }

    const init = async () => {
      try {
        if (!currentUser) {
          const user = await getMe();
          setCurrentUser(user);
        }
      } catch {
        router.replace("/login");
      } finally {
        setChecked(true);
      }
    };

    init();
  }, [currentUser, pathname, router, setCurrentUser, shouldSkip]);

  if (!checked) {
    return <div className="min-h-screen bg-white" />;
  }

  return <>{children}</>;
}
