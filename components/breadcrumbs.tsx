"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";

const breadcrumbLabels: Record<string, string> = {
  "/": "Dashboard",
  "/medicines": "Medicines",
  "/approvals-workflow": "Approvals",
  "/inventory": "Inventory",
  "/inspections": "Inspections",
  "/laboratory": "Laboratory",
  "/manufacturers": "Manufacturers",
  "/documents": "Documents",
  "/verify": "Verify",
  "/alerts": "Alerts",
  "/analytics": "Analytics",
};

interface BreadcrumbItem {
  label: string;
  href: string;
}

export default function Breadcrumbs() {
  const pathname = usePathname();

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [{ label: "Dashboard", href: "/" }];

    if (pathname === "/") return [];

    const pathSegments = pathname.split("/").filter(Boolean);

    pathSegments.forEach((segment, index) => {
      const href = "/" + pathSegments.slice(0, index + 1).join("/");
      const label = breadcrumbLabels[href] || segment.replace(/-/g, " ");
      items.push({ label, href });
    });

    return items;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length === 0) return null;

  return (
    <div className="flex items-center gap-2 text-sm mb-6">
      {breadcrumbs.map((item, index) => (
        <div key={item.href} className="flex items-center gap-2">
          <Link
            href={item.href}
            className={`transition-colors duration-200 ${
              index === breadcrumbs.length - 1
                ? "text-gray-900 font-medium"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {item.label}
          </Link>
          {index < breadcrumbs.length - 1 && (
            <ChevronRight size={16} className="text-gray-300" />
          )}
        </div>
      ))}
    </div>
  );
}
