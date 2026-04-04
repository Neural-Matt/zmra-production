"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Pill,
  CheckCircle,
  Package,
  ClipboardList,
  Beaker,
  Building2,
  BarChart3,
  Menu,
  X,
  FileText,
  ShieldAlert,
  Bell,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navigationItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/medicines", label: "Medicines", icon: Pill },
  { href: "/approvals-workflow", label: "Approvals", icon: CheckCircle },
  { href: "/inventory", label: "Inventory", icon: Package },
  { href: "/inspections", label: "Inspections", icon: ClipboardList },
  { href: "/laboratory", label: "Laboratory", icon: Beaker },
  { href: "/manufacturers", label: "Manufacturers", icon: Building2 },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/verify", label: "Verify", icon: ShieldAlert },
  { href: "/alerts", label: "Alerts", icon: Bell },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-white border border-gray-200 text-gray-900 p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r border-gray-200 text-gray-900 p-6 overflow-y-auto transition-all duration-300",
          !isOpen && "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo/Header */}
        <div className="mb-8 pb-6 border-b border-gray-200">
          <Link href="/" className="flex items-center gap-3 mb-4 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center font-bold text-white group-hover:shadow-lg transition-shadow duration-200">
              Z
            </div>
            <div>
              <div className="text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">ZMRA</div>
              <p className="text-xs text-gray-500">Regulatory Platform</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 relative group",
                  isActive
                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-r-full" />
                )}
                <Icon size={18} className="flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
                {isActive && (
                  <span className="w-2 h-2 bg-blue-600 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-6 left-6 right-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-900">ZMRA v1.0</p>
              <p className="text-xs text-gray-500">Regulatory Authority</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content margin */}
      <div className="hidden lg:block w-64 flex-shrink-0" />
    </>
  );
}
