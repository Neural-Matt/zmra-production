'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const [stats] = useState({
    totalMedicines: 50,
    activeInventory: 1250,
    pendingApprovals: 12,
    completedTests: 89,
    manufacturers: 35,
    lowStockAlerts: 8,
  });

  const recentActivities = [
    { id: 1, type: 'Inventory', description: 'Paracetamol batch received', time: '2 hours ago' },
    { id: 2, type: 'Approval', description: 'Ibuprofen workflow approved', time: '4 hours ago' },
    { id: 3, type: 'Test', description: 'Lab test completed for Aspirin', time: '1 day ago' },
    { id: 4, type: 'Inspection', description: 'Facility inspection scheduled', time: '2 days ago' },
  ];

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Total Medicines', value: stats.totalMedicines, color: 'blue', icon: '💊' },
            { label: 'Active Inventory', value: stats.activeInventory, color: 'green', icon: '📦' },
            { label: 'Pending Approvals', value: stats.pendingApprovals, color: 'yellow', icon: '⏳' },
            { label: 'Completed Tests', value: stats.completedTests, color: 'purple', icon: '✅' },
            { label: 'Manufacturers', value: stats.manufacturers, color: 'pink', icon: '🏭' },
            { label: 'Low Stock Alerts', value: stats.lowStockAlerts, color: 'red', icon: '⚠️' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
              <p className="text-gray-600 mb-2">{stat.label}</p>
              <p className="text-4xl font-bold text-blue-600 mb-1">{stat.value}</p>
              <span className="text-2xl">{stat.icon}</span>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="border-l-4 border-blue-600 pl-4 py-2">
                    <p className="font-semibold">{activity.type}: {activity.description}</p>
                    <p className="text-gray-500 text-sm">{activity.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6">Quick Links</h2>
            <div className="space-y-3">
              <Link href="/inventory" className="block bg-blue-50 hover:bg-blue-100 p-3 rounded-lg font-semibold text-blue-600 transition">
                📦 Manage Inventory
              </Link>
              <Link href="/approvals-workflow" className="block bg-green-50 hover:bg-green-100 p-3 rounded-lg font-semibold text-green-600 transition">
                ✅ Approvals Workflow
              </Link>
              <Link href="/laboratory" className="block bg-purple-50 hover:bg-purple-100 p-3 rounded-lg font-semibold text-purple-600 transition">
                🧪 Laboratory Tests
              </Link>
              <Link href="/inspections" className="block bg-orange-50 hover:bg-orange-100 p-3 rounded-lg font-semibold text-orange-600 transition">
                🔍 Facility Inspections
              </Link>
              <Link href="/analytics" className="block bg-pink-50 hover:bg-pink-100 p-3 rounded-lg font-semibold text-pink-600 transition">
                📊 Analytics & Reports
              </Link>
              <Link href="/manufacturers" className="block bg-indigo-50 hover:bg-indigo-100 p-3 rounded-lg font-semibold text-indigo-600 transition">
                🏭 Manufacturers
              </Link>
              <Link href="/documents" className="block bg-red-50 hover:bg-red-100 p-3 rounded-lg font-semibold text-red-600 transition">
                📄 Documents
              </Link>
              <Link href="/alerts" className="block bg-yellow-50 hover:bg-yellow-100 p-3 rounded-lg font-semibold text-yellow-600 transition">
                🔔 System Alerts
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
