"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path
      ? "bg-white/10 text-white"
      : "text-white/60 hover:text-white hover:bg-white/5";
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="fixed w-full top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center space-x-8">
              <Link
                href="/admin"
                className="text-2xl font-medium tracking-tight"
              >
                FocusHouse
              </Link>
              <div className="hidden md:flex md:space-x-2">
                <Link
                  href="/admin"
                  className={`${isActive("/admin")} px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/studios"
                  className={`${isActive("/admin/studios")} px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200`}
                >
                  Packages
                </Link>
                <Link
                  href="/admin/bookings"
                  className={`${isActive("/admin/bookings")} px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200`}
                >
                  Sessions
                </Link>
                <Link
                  href="/admin/accessories"
                  className={`${isActive("/admin/accessories")} px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200`}
                >
                  Accessories
                </Link>
                <Link
                  href="/admin/repair-services"
                  className={`${isActive("/admin/repair-services")} px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200`}
                >
                  Repairs
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                target="_blank"
                className="text-sm text-white/60 hover:text-white transition-colors duration-200"
              >
                View Site
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/auth/signin" })}
                className="text-sm px-4 py-2 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all duration-200"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="pt-20">{children}</main>
    </div>
  );
}
