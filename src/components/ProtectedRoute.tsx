"use client";

import { useSession } from "@/context/SessionContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
  children,
  adminOnly = false,
}: {
  children: React.ReactNode;
  adminOnly?: boolean;
}) {
  const { user, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/auth");
      } else if (adminOnly && !user.isSuperadmin) {
        router.push("/dashboard");
      }
    }
  }, [user, isLoading, router, adminOnly]);

  if (isLoading || !user || (adminOnly && !user.isSuperadmin)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return <>{children}</>;
}
