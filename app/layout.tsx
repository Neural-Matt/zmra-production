import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZMRA - Medicine Recommendation System",
  description: "Comprehensive medicine inventory and recommendation system",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 shadow-lg">
          <div className="max-w-6xl mx-auto px-4">
            <Link href="/" className="text-2xl font-bold hover:opacity-90">
              ZMRA System
            </Link>
          </div>
        </header>

        <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <ul className="flex gap-6 flex-wrap text-sm">
              <li><Link href="/" className="hover:text-blue-600 font-medium">Home</Link></li>
              <li><Link href="/dashboard" className="hover:text-blue-600 font-medium">Dashboard</Link></li>
              <li><Link href="/medicines" className="hover:text-blue-600 font-medium">Medicines</Link></li>
              <li><Link href="/search" className="hover:text-blue-600 font-medium">Search</Link></li>
              <li><Link href="/inventory" className="hover:text-blue-600 font-medium">Inventory</Link></li>
              <li><Link href="/approvals-workflow" className="hover:text-blue-600 font-medium">Approvals</Link></li>
              <li><Link href="/laboratory" className="hover:text-blue-600 font-medium">Laboratory</Link></li>
              <li><Link href="/inspections" className="hover:text-blue-600 font-medium">Inspections</Link></li>
              <li><Link href="/analytics" className="hover:text-blue-600 font-medium">Analytics</Link></li>
              <li><Link href="/documents" className="hover:text-blue-600 font-medium">Documents</Link></li>
              <li><Link href="/manufacturers" className="hover:text-blue-600 font-medium">Manufacturers</Link></li>
              <li><Link href="/alerts" className="hover:text-blue-600 font-medium">Alerts</Link></li>
              <li><Link href="/about" className="hover:text-blue-600 font-medium">About</Link></li>
            </ul>
          </div>
        </nav>

        {children}

        <footer className="bg-gray-800 text-white py-10 mt-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <h4 className="font-bold mb-3">System</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li><Link href="/" className="hover:text-white">Home</Link></li>
                  <li><Link href="/dashboard" className="hover:text-white">Dashboard</Link></li>
                  <li><Link href="/about" className="hover:text-white">About</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-3">Inventory</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li><Link href="/medicines" className="hover:text-white">Medicines</Link></li>
                  <li><Link href="/inventory" className="hover:text-white">Inventory</Link></li>
                  <li><Link href="/manufacturers" className="hover:text-white">Manufacturers</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-3">Operations</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li><Link href="/laboratory" className="hover:text-white">Laboratory</Link></li>
                  <li><Link href="/inspections" className="hover:text-white">Inspections</Link></li>
                  <li><Link href="/analytics" className="hover:text-white">Analytics</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-700 pt-6 text-center">
              <p>&copy; 2026 ZMRA System. All rights reserved.</p>
              <p className="text-gray-400 mt-2">Medicine Recommendation & Inventory Assistant</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
