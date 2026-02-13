"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  Compass,
  Heart,
  Home,
  LogIn,
  Menu,
  PlusSquare,
  Search,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Avatar from "./ui/avatar";

/**
 * Navbar — top navigation bar on desktop, bottom tab bar on mobile.
 *
 * Desktop: horizontal bar pinned to the top with logo, search, and icon links.
 * Mobile:  fixed bottom tab bar with the five primary destinations + a
 *          hamburger overflow menu for secondary links.
 *
 * The component highlights the active route using `usePathname()`.
 */

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { href: "/", label: "Home", icon: <Home size={24} /> },
  { href: "/explore", label: "Explore", icon: <Compass size={24} /> },
  { href: "/create", label: "Create", icon: <PlusSquare size={24} /> },
  { href: "/activity", label: "Activity", icon: <Heart size={24} /> },
  { href: "/profile", label: "Profile", icon: <Avatar alt="You" size="sm" /> },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Don't show navbar on auth pages
  if (pathname.startsWith("/login") || pathname.startsWith("/signup")) {
    return null;
  }

  return (
    <>
      {/* ───── Desktop top bar ───── */}
      <header className="fixed inset-x-0 top-0 z-50 hidden h-16 border-b border-border bg-card/80 backdrop-blur-md md:block">
        <nav className="mx-auto flex h-full max-w-5xl items-center justify-between px-6">
          {/* Logo / brand */}
          <Link href="/" className="text-xl font-bold tracking-tight">
            Social App
          </Link>

          {/* Search bar */}
          <div className="relative w-64">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search"
              className="h-9 w-full rounded-lg bg-muted pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
            />
          </div>

          {/* Nav links */}
          <div className="flex items-center gap-5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-colors hover:text-foreground",
                  pathname === item.href
                    ? "text-foreground"
                    : "text-muted-foreground",
                )}
                aria-label={item.label}
              >
                {item.icon}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      {/* ───── Mobile bottom tab bar ───── */}
      <nav className="fixed inset-x-0 bottom-0 z-50 flex h-14 items-center justify-around border-t border-border bg-card/90 backdrop-blur-md md:hidden">
        {navItems.slice(0, 4).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-0.5 text-xs transition-colors",
              pathname === item.href
                ? "text-foreground"
                : "text-muted-foreground",
            )}
            aria-label={item.label}
          >
            {item.icon}
          </Link>
        ))}

        {/* Hamburger for overflow */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="text-muted-foreground"
          aria-label="Menu"
        >
          <Menu size={24} />
        </button>
      </nav>

      {/* ───── Mobile slide-up menu ───── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-50 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Sheet */}
            <motion.div
              className="fixed inset-x-0 bottom-0 z-50 rounded-t-2xl bg-card p-6"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-lg font-semibold">Menu</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col gap-3">
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl p-3 hover:bg-muted"
                >
                  <Avatar alt="You" size="md" />
                  <span className="font-medium">Your Profile</span>
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl p-3 hover:bg-muted"
                >
                  <LogIn size={20} />
                  <span className="font-medium">Log In</span>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
