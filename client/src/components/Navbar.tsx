// components/Navbar.tsx
"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  // Don't show Navbar on auth pages
  if (pathname === "/login" || pathname === "/signup") return null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <nav className="w-full px-6 py-3 flex items-center justify-between border-b bg-white shadow-sm">
      <Link href="/">
        <Logo size="small" />
      </Link>

      <div className="flex gap-6 items-center">
        <Link
          href="/applications"
          className={`text-sm font-medium ${
            pathname === "/applications"
              ? "text-[#0f172a]"
              : "text-muted-foreground"
          }`}
        >
          Applications
        </Link>

        <Button variant="ghost" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </nav>
  );
}
