"use client";

import { Search, Sun, Moon, Bell, User, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import Breadcrumbs from "./breadcrumbs";

export default function Header() {
  const [isDark, setIsDark] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    setTime(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Listen for Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(!searchOpen);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen]);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100 backdrop-blur-10">
      <div className="px-6 lg:px-8 py-4 space-y-4">
        {/* Top row - Actions */}
        <div className="flex items-center justify-between">
          {/* Left spacer */}
          <div className="flex-1" />

          {/* Center - Global Search */}
          <div className="flex-1 max-w-md">
            <button
              onClick={() => setSearchOpen(true)}
              className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-100 transition-all duration-200 group"
            >
              <div className="flex items-center gap-2">
                <Search size={16} className="text-gray-400" />
                <span>Search medicines, batches...</span>
              </div>
              <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-white border border-gray-200 rounded text-xs font-medium text-gray-600 group-hover:border-gray-300">
                <span className="font-semibold">⌘</span>K
              </div>
            </button>
          </div>

          {/* Right - Controls */}
          <div className="flex-1 flex items-center justify-end gap-2">
            {/* Time */}
            <div className="text-right hidden lg:block mr-6">
              <p className="text-sm font-semibold text-gray-900">{time}</p>
            </div>

            {/* Divider */}
            <div className="hidden lg:block w-px h-6 bg-gray-200" />

            {/* Notification */}
            <button className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Settings */}
            <button className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200">
              <Settings size={18} />
            </button>

            {/* User Profile */}
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200 ml-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                AD
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-gray-900">Admin</p>
                <p className="text-xs text-gray-500">Authority</p>
              </div>
            </button>
          </div>
        </div>

        {/* Breadcrumbs */}
        <Breadcrumbs />
      </div>
    </header>
  );
}
