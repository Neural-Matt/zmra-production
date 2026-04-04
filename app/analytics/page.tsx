"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from "recharts";
import { medicines, manufacturers, batches, inspections, laboratoryTests } from "@/lib/data";
import { TrendingUp } from "lucide-react";

export default function AnalyticsPage() {
  // Medicine status distribution
  const medicineStatusData = [
    { name: "Approved", value: medicines.filter((m) => m.status === "approved").length },
    { name: "Pending", value: medicines.filter((m) => m.status === "pending").length },
    { name: "Suspended", value: medicines.filter((m) => m.status === "suspended").length },
    { name: "Revoked", value: medicines.filter((m) => m.status === "revoked").length },
  ];

  // Batch distribution
  const batchStatusData = [
    { name: "Available", value: batches.filter((b) => b.status === "available").length },
    { name: "Reserved", value: batches.filter((b) => b.status === "reserved").length },
    { name: "Distributed", value: batches.filter((b) => b.status === "distributed").length },
    { name: "Expired", value: batches.filter((b) => b.status === "expired").length },
  ];

  // Manufacturer country distribution
  const manufacturerCountryData = useMemo(() => {
    const data: Record<string, number> = {};
    manufacturers.forEach((mfr) => {
      data[mfr.country] = (data[mfr.country] || 0) + 1;
    });
    return Object.entries(data)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, []);

  // Therapeutic category distribution
  const categoryData = useMemo(() => {
    const data: Record<string, number> = {};
    medicines.forEach((med) => {
      data[med.therapeuticCategory] = (data[med.therapeuticCategory] || 0) + 1;
    });
    return Object.entries(data)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);
  }, []);

  // Inspection findings severity
  const inspectionData = [
    { name: "Critical", value: inspections.filter((i) => i.findingsSeverity === "critical").length, color: "#ef4444" },
    { name: "Major", value: inspections.filter((i) => i.findingsSeverity === "major").length, color: "#f97316" },
    { name: "Minor", value: inspections.filter((i) => i.findingsSeverity === "minor").length, color: "#eab308" },
    { name: "None", value: inspections.filter((i) => i.findingsSeverity === "none").length, color: "#22c55e" },
  ];

  // Lab test performance
  const testPerformanceData = [
    { name: "Passed", value: laboratoryTests.filter((t) => t.status === "passed").length, color: "#10b981" },
    { name: "Failed", value: laboratoryTests.filter((t) => t.status === "failed").length, color: "#ef4444" },
    { name: "Pending", value: laboratoryTests.filter((t) => t.status === "pending").length, color: "#f59e0b" },
  ];

  // Medicines approved by year
  const approvalsPerYear = useMemo(() => {
    const yearMap: Record<number, number> = {};
    medicines.forEach((med) => {
      if (med.status === 'approved' && med.approvalDate) {
        const year = new Date(med.approvalDate).getFullYear();
        yearMap[year] = (yearMap[year] || 0) + 1;
      }
    });
    return Object.entries(yearMap)
      .map(([year, count]) => ({ year: parseInt(year), count }))
      .sort((a, b) => a.year - b.year)
      .slice(-10); // Last 10 years
  }, []);

  // Top manufacturers by product count
  const topManufacturersData = useMemo(() => {
    const mfrMap: Record<string, number> = {};
    medicines.forEach((med) => {
      mfrMap[med.manufacturer] = (mfrMap[med.manufacturer] || 0) + 1;
    });
    return Object.entries(mfrMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, []);

  // Inspections by company (location)
  const inspectionsByLocation = useMemo(() => {
    const locMap: Record<string, number> = {};
    inspections.forEach((insp) => {
      locMap[insp.facilityName] = (locMap[insp.facilityName] || 0) + 1;
    });
    return Object.entries(locMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, []);

  // Statistics
  const stats = {
    totalMedicines: medicines.length,
    totalManufacturers: manufacturers.length,
    totalBatches: batches.length,
    totalInspections: inspections.length,
    avgBatchSize: Math.round(batches.reduce((sum, b) => sum + b.quantity, 0) / batches.length),
    passRate: ((laboratoryTests.filter((t) => t.status === "passed").length / laboratoryTests.length) * 100).toFixed(1),
  };

  const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div className="p-4 lg:p-8 bg-slate-50">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
        <p className="text-gray-600 mt-2">Comprehensive regulatory data analytics and insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {[
          { label: "Total Medicines", value: stats.totalMedicines, color: "bg-blue-50 text-blue-600" },
          { label: "Manufacturers", value: stats.totalManufacturers, color: "bg-purple-50 text-purple-600" },
          { label: "Batches", value: stats.totalBatches, color: "bg-green-50 text-green-600" },
          { label: "Inspections", value: stats.totalInspections, color: "bg-yellow-50 text-yellow-600" },
          { label: "Avg Batch Size", value: stats.avgBatchSize.toLocaleString(), color: "bg-orange-50 text-orange-600" },
          { label: "Lab Pass Rate", value: `${stats.passRate}%`, color: "bg-red-50 text-red-600" },
        ].map((stat, idx) => (
          <div key={idx} className={`${stat.color} rounded-lg p-4 text-center`}>
            <p className="text-xs font-semibold opacity-70">{stat.label}</p>
            <p className="text-2xl font-bold mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Medicines Approved by Year */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Medicines Approved by Year</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={approvalsPerYear}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Manufacturers by Registered Products */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Manufacturers by Registered Products</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={topManufacturersData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 200, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={195} />
              <Tooltip />
              <Bar dataKey="count" fill="#10b981" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Batch Status Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Batch Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={batchStatusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Lab Test Results */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Laboratory Test Results</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={testPerformanceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {testPerformanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Inspection Findings Severity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Inspection Findings Severity</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={inspectionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Manufacturers by Country */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Manufacturers by Country</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={manufacturerCountryData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="country" width={95} />
              <Tooltip />
              <Bar dataKey="count" fill="#06b6d4" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Inspections by Facility */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Facilities by Inspection Count</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={inspectionsByLocation}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={145} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#f59e0b" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Therapeutic Categories */}
        <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Medicines by Therapeutic Category</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={categoryData}
              margin={{ top: 20, right: 30, left: 30, bottom: 120 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" angle={-45} textAnchor="end" height={120} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#ec4899" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={24} className="text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Key Insights</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-l-4 border-blue-500 pl-4">
            <p className="font-medium text-gray-900">Regulatory Coverage</p>
            <p className="text-sm text-gray-600 mt-1">
              ZMRA currently manages {stats.totalMedicines} registered medicines from {stats.totalManufacturers} manufacturers across the region.
            </p>
          </div>
          <div className="border-l-4 border-green-500 pl-4">
            <p className="font-medium text-gray-900">Quality Assurance</p>
            <p className="text-sm text-gray-600 mt-1">
              Laboratory testing demonstrates {stats.passRate}% compliance rate with quality specifications across all batch inspections.
            </p>
          </div>
          <div className="border-l-4 border-yellow-500 pl-4">
            <p className="font-medium text-gray-900">Batch Management</p>
            <p className="text-sm text-gray-600 mt-1">
              Currently tracking {stats.totalBatches} pharmaceutical batches with an average batch size of {stats.avgBatchSize.toLocaleString()} units.
            </p>
          </div>
          <div className="border-l-4 border-purple-500 pl-4">
            <p className="font-medium text-gray-900">Compliance Monitoring</p>
            <p className="text-sm text-gray-600 mt-1">
              {stats.totalInspections} inspections conducted to ensure manufacturer compliance with GMP and regulatory requirements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
