'use client';

import { useState, useEffect } from 'react';

export default function AnalyticsPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    setStats({
      totalMedicines: 50,
      totalInventory: 12500,
      totalApprovals: 150,
      approvalRate: 92,
      testPass: 95,
      testFail: 5,
      inspectionPass: 88,
      inspectionFail: 12,
      avgProcessTime: 4.5,
      manufacturersActive: 25,
      categoriesManaged: 12,
      monthlyOrders: 450,
      weeklyGrowth: 8.5,
      revenue: '$125000'
    });
  }, []);

  if (!stats) return <div className="flex justify-center items-center min-h-screen">Loading analytics...</div>;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Analytics & Reports</h1>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Total Medicines</p>
            <p className="text-3xl font-bold text-blue-600">{stats.totalMedicines}</p>
            <p className="text-xs text-green-600 mt-2">+12% vs last month</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Total Inventory</p>
            <p className="text-3xl font-bold text-purple-600">{stats.totalInventory}</p>
            <p className="text-xs text-green-600 mt-2">Units in stock</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Approval Rate</p>
            <p className="text-3xl font-bold text-green-600">{stats.approvalRate}%</p>
            <p className="text-xs text-green-600 mt-2">+2% vs last month</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Avg Process Time</p>
            <p className="text-3xl font-bold text-orange-600">{stats.avgProcessTime} days</p>
            <p className="text-xs text-green-600 mt-2">-0.5 days faster</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Test Results Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Laboratory Test Results</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pass Rate: {stats.testPass}%</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: `${stats.testPass}%`}}></div>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Fail Rate: {stats.testFail}%</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{width: `${stats.testFail}%`}}></div>
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded">
              <p className="text-sm"><span className="font-semibold">1425</span> tests completed this month</p>
            </div>
          </div>

          {/* Inspection Results Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Facility Inspection Results</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pass Rate: {stats.inspectionPass}%</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: `${stats.inspectionPass}%`}}></div>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Fail Rate: {stats.inspectionFail}%</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{width: `${stats.inspectionFail}%`}}></div>
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded">
              <p className="text-sm"><span className="font-semibold">34</span> inspections completed this month</p>
            </div>
          </div>
        </div>

        {/* Operations Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4">Operations</h3>
            <div className="space-y-3">
              <div className="flex justify-between"><span>Monthly Orders</span><span className="font-bold text-green-600">{stats.monthlyOrders}</span></div>
              <div className="flex justify-between"><span>Weekly Growth</span><span className="font-bold text-green-600">+{stats.weeklyGrowth}%</span></div>
              <div className="flex justify-between"><span>Monthly Revenue</span><span className="font-bold text-green-600">{stats.revenue}</span></div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4">System Health</h3>
            <div className="space-y-3">
              <div className="flex justify-between"><span>Active Manufacturers</span><span className="font-bold text-blue-600">{stats.manufacturersActive}</span></div>
              <div className="flex justify-between"><span>Categories</span><span className="font-bold text-blue-600">{stats.categoriesManaged}</span></div>
              <div className="flex justify-between"><span>System Status</span><span className="font-bold text-green-600">● Healthy</span></div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4">Performance</h3>
            <div className="space-y-3">
              <div className="flex justify-between"><span>Avg Response Time</span><span className="font-bold text-blue-600">245ms</span></div>
              <div className="flex justify-between"><span>Uptime</span><span className="font-bold text-green-600">99.8%</span></div>
              <div className="flex justify-between"><span>API Health</span><span className="font-bold text-green-600">● Optimal</span></div>
            </div>
          </div>
        </div>

        {/* Recent Trends */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Monthly Trends</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="w-24 text-sm">January</span>
              <div className="flex-1 bg-gray-100 rounded h-8 flex items-center" style={{width: '100%'}}>
                <div className="bg-blue-500 h-8 rounded flex items-center pl-2 text-white text-xs font-semibold" style={{width: '65%'}}>320 units</div>
              </div>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-sm">February</span>
              <div className="flex-1 bg-gray-100 rounded h-8 flex items-center" style={{width: '100%'}}>
                <div className="bg-blue-500 h-8 rounded flex items-center pl-2 text-white text-xs font-semibold" style={{width: '75%'}}>380 units</div>
              </div>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-sm">March</span>
              <div className="flex-1 bg-gray-100 rounded h-8 flex items-center" style={{width: '100%'}}>
                <div className="bg-blue-500 h-8 rounded flex items-center pl-2 text-white text-xs font-semibold" style={{width: '82%'}}>415 units</div>
              </div>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-sm">April</span>
              <div className="flex-1 bg-gray-100 rounded h-8 flex items-center" style={{width: '100%'}}>
                <div className="bg-blue-500 h-8 rounded flex items-center pl-2 text-white text-xs font-semibold" style={{width: '88%'}}>450 units</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
