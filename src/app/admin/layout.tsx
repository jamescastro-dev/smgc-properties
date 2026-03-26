"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  Building2,
  Users,
  LogOut,
  Menu,
  X,
  Calculator,
  ChevronRight,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Properties", href: "/admin/properties", icon: Building2 },
  { label: "Leads", href: "/admin/leads", icon: Users },
  { label: "Calculator", href: "/admin/calculator", icon: Calculator },
] as const;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.email) setUserEmail(user.email);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  if (pathname === "/admin/login") return <>{children}</>;

  const currentPage =
    NAV_ITEMS.find((item) =>
      item.href === "/admin"
        ? pathname === "/admin"
        : pathname.startsWith(item.href)
    )?.label ?? "Admin";

  const avatarLetter = userEmail ? userEmail.charAt(0).toUpperCase() : "A";

  return (
    <div data-theme="admin" className="min-h-screen bg-luxury-900 flex">

      {/* ── Sidebar ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-luxury-800 border-r border-luxury-700/80 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Brand */}
        <div className="px-5 py-5 border-b border-luxury-700/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gold-500/10 border border-gold-500/25 flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4 text-gold-500" />
            </div>
            <div className="min-w-0">
              <p className="text-luxury-50 text-sm font-bold leading-tight truncate">
                Broker Shella
              </p>
              <p className="text-gold-500/70 text-[10px] tracking-widest uppercase mt-0.5">
                Admin Portal
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 flex flex-col gap-0.5">
          <p className="text-luxury-600 text-[10px] font-bold tracking-widest uppercase px-3 mb-2">
            Navigation
          </p>
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gold-500/12 text-gold-400 border border-gold-500/25"
                    : "text-luxury-400 hover:text-luxury-100 hover:bg-luxury-700/60 border border-transparent"
                }`}
              >
                <item.icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? "text-gold-500" : "text-luxury-500 group-hover:text-luxury-300"
                  }`}
                />
                <span className="flex-1">{item.label}</span>
                {isActive && (
                  <ChevronRight className="w-3 h-3 text-gold-500/50 shrink-0" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="px-3 py-4 border-t border-luxury-700/80">
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-7 h-7 rounded-full bg-gold-500/15 border border-gold-500/30 flex items-center justify-center shrink-0">
              <span className="text-gold-500 text-[11px] font-bold">
                {avatarLetter}
              </span>
            </div>
            <p className="text-luxury-400 text-xs truncate flex-1">{userEmail}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-luxury-500 hover:text-red-400 hover:bg-red-500/8 border border-transparent hover:border-red-500/15 transition-all duration-200"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Main ── */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">

        {/* Top bar — all screen sizes */}
        <header className="sticky top-0 z-30 bg-luxury-900/95 backdrop-blur-md border-b border-luxury-700/80 px-5 lg:px-8 h-14 flex items-center justify-between gap-4 shrink-0">
          {/* Left */}
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden w-8 h-8 rounded-lg bg-luxury-800 border border-luxury-700 flex items-center justify-center text-luxury-400 hover:text-luxury-50 transition-colors"
            >
              {sidebarOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-luxury-600 hidden lg:block">Admin</span>
              <ChevronRight className="w-3.5 h-3.5 text-luxury-700 hidden lg:block" />
              <span className="text-luxury-50 font-semibold">{currentPage}</span>
            </div>
          </div>

          {/* Right — desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-2.5 bg-luxury-800 border border-luxury-700 rounded-xl px-3 py-1.5">
              <div className="w-6 h-6 rounded-full bg-gold-500/15 border border-gold-500/30 flex items-center justify-center shrink-0">
                <span className="text-gold-500 text-[10px] font-bold">
                  {avatarLetter}
                </span>
              </div>
              <span className="text-luxury-400 text-xs truncate max-w-48">
                {userEmail}
              </span>
            </div>
          </div>
        </header>

        {/* Page content — centered on large screens */}
        <main className="flex-1 p-5 lg:p-7 xl:p-8">
          {children}
        </main>

      </div>
    </div>
  );
}
