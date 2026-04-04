"use client";

import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="card-base rounded-2xl p-12 text-center">
      <div className="flex justify-center mb-6">
        <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl">
          <Icon size={48} className="text-blue-600" />
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-8 max-w-xs mx-auto">{description}</p>

      {action && (
        <button
          onClick={action.onClick}
          className="btn-primary inline-flex"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
