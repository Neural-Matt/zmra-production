import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZMRA - Medicine Recommendation System",
  description: "Comprehensive medicine inventory and recommendation system",
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
            <ul className="flex gap-8 flex-wrap">
              <li><Link href="/" className="hover:text-blue-600 font-medium">Home</Link></li>
              <li><Link href="/medicines" className="hover:text-blue-600 font-medium">Medicines</Link></li>
              <li><Link href="/search" className="hover:text-blue-600 font-medium">Search</Link></li>
              <li><Link href="/about" className="hover:text-blue-600 font-medium">About</Link></li>
            </ul>
          </div>
        </nav>

        {children}

        <footer className="bg-gray-800 text-white py-8 mt-20">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <p>&copy; 2026 ZMRA System. All rights reserved.</p>
            <p className="text-gray-400 mt-2">Medicine Recommendation & Inventory Assistant</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
