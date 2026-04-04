"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  function isActive(href: string) {
    return pathname === href;
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <nav className="fixed w-full top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link
            href="/"
            onClick={closeMenu}
            className="flex items-center gap-2 text-2xl font-medium tracking-tight"
          >
            <img
              src="/focus_house_icon.jpeg"
              alt="FocusHouse"
              className="h-8 w-8 rounded"
            />
            FocusHouse
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`text-sm transition-colors duration-200 ${isActive("/") ? "text-white" : "text-white/60 hover:text-white"}`}
            >
              Home
            </Link>
            <Link
              href="/photography"
              className={`text-sm transition-colors duration-200 ${isActive("/photography") ? "text-white" : "text-white/60 hover:text-white"}`}
            >
              Photography and Videography
            </Link>
            <div className="relative group">
              <Link
                href="/accessories"
                className={`text-sm transition-colors duration-200 ${pathname.startsWith("/accessories") || isActive("/agreement") ? "text-white" : "text-white/60 hover:text-white"}`}
              >
                Sewa Camera JB
              </Link>
              <div className="absolute top-full left-0 mt-2 w-48 bg-black/90 backdrop-blur-md border border-white/10 rounded-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link
                  href="/accessories?tab=combo"
                  className="block px-4 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors duration-200"
                >
                  Combo Package
                </Link>
                <Link
                  href="/accessories?tab=agreement"
                  className="block px-4 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors duration-200"
                >
                  Agreement
                </Link>
              </div>
            </div>
            <Link
              href="/repair"
              className={`text-sm transition-colors duration-200 ${isActive("/repair") ? "text-white" : "text-white/60 hover:text-white"}`}
            >
              Repair
            </Link>
            <Link
              href="/contact"
              className={`text-sm transition-colors duration-200 ${isActive("/contact") ? "text-white" : "text-white/60 hover:text-white"}`}
            >
              Contact
            </Link>
          </div>

          {/* Hamburger button */}
          <button
            className="md:hidden p-2 text-white/60 hover:text-white transition-colors"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/10 bg-black/95 backdrop-blur-md">
          <div className="px-6 py-4 flex flex-col gap-1">
            <Link
              href="/"
              onClick={closeMenu}
              className={`py-3 text-sm border-b border-white/5 transition-colors duration-200 ${isActive("/") ? "text-white" : "text-white/60 hover:text-white"}`}
            >
              Home
            </Link>
            <Link
              href="/photography"
              onClick={closeMenu}
              className={`py-3 text-sm border-b border-white/5 transition-colors duration-200 ${isActive("/photography") ? "text-white" : "text-white/60 hover:text-white"}`}
            >
              Photography and Videography
            </Link>
            <div className="py-3 border-b border-white/5">
              <p className="text-sm text-white/60 mb-2">Sewa Camera JB</p>
              <div className="pl-4 flex flex-col gap-1">
                <Link
                  href="/accessories"
                  onClick={closeMenu}
                  className="py-1.5 text-sm text-white/40 hover:text-white transition-colors duration-200"
                >
                  All Items
                </Link>
                <Link
                  href="/accessories?tab=combo"
                  onClick={closeMenu}
                  className="py-1.5 text-sm text-white/40 hover:text-white transition-colors duration-200"
                >
                  Combo Package
                </Link>
                <Link
                  href="/accessories?tab=agreement"
                  onClick={closeMenu}
                  className="py-1.5 text-sm text-white/40 hover:text-white transition-colors duration-200"
                >
                  Agreement
                </Link>
              </div>
            </div>
            <Link
              href="/repair"
              onClick={closeMenu}
              className={`py-3 text-sm border-b border-white/5 transition-colors duration-200 ${isActive("/repair") ? "text-white" : "text-white/60 hover:text-white"}`}
            >
              Repair
            </Link>
            <Link
              href="/contact"
              onClick={closeMenu}
              className={`py-3 text-sm transition-colors duration-200 ${isActive("/contact") ? "text-white" : "text-white/60 hover:text-white"}`}
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
