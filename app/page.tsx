"use client";

import { useMemo } from "react";
import { formatDate } from "@/lib/dateUtils";
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
} from "recharts";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Package,
  Building2,
  Pill,
  ClipboardList,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import {
  medicines,
  manufacturers,
  batches,
  inspections,
  laboratoryTests,
  safetyAlerts,
  regulatoryApprovals,
} from "@/lib/data";

const KPICard = ({ icon: Icon, label, value, color, trend }: { icon: any; label: string; value: number | string; color: string; trend?: string }) => (
  <div className="card-elevated">
    <div className="flex items-start justify-between gap-2">
      <div className="flex-1">
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
          {label}
        </p>
        <p className="text-2xl lg:text-3xl font-semibold text-gray-900 mt-3">
          {value}
        </p>
        {trend && (
          <p className="text-xs text-green-600 font-semibold mt-2">↑ {trend}</p>
        )}
      </div>
      <div className="p-2 rounded-lg flex-shrink-0" style={{ backgroundColor: `${color}15` }}>
        <Icon size={24} style={{ color }} />
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const kpis = useMemo(() => ({
    totalMedicines: medicines.length,
    underReview: medicines.filter((m) => m.status === "pending").length,
    activeRecalls: safetyAlerts.filter((a) => a.status === "active").length,
    totalManufacturers: manufacturers.filter((m) => m.status === "active")
      .length,
    inspectionsConducted: inspections.filter((i) => i.status === "completed")
      .length,
    batchesTracked: batches.length,
  }), []);

  const recentApprovals = regulatoryApprovals
    .filter((a) => a.status === "approved")
    .sort(
      (a, b) =>
        new Date(b.approvalDate).getTime() -
        new Date(a.approvalDate).getTime()
    )
    .slice(0, 5);

  const recentInspections = inspections
    .filter((i) => i.status === "completed")
    .sort(
      (a, b) =>
        new Date(b.completionDate).getTime() -
        new Date(a.completionDate).getTime()
    )
    .slice(0, 5);

  const recentAlerts = safetyAlerts
    .sort(
      (a, b) =>
        new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()
    )
    .slice(0, 5);

  const therapeuticData = [
    { category: "Antibiotics", count: 8 },
    { category: "Cardiovascular", count: 7 },
    { category: "Gastrointestinal", count: 5 },
    { category: "Psychiatric", count: 3 },
    { category: "Analgesics", count: 4 },
    { category: "Antiretrovirals", count: 4 },
    { category: "Antimalarials", count: 4 },
  ];

  const approvalTrendData = [
    { month: "Jan", approvals: 12, rejections: 2, underReview: 5 },
    { month: "Feb", approvals: 15, rejections: 1, underReview: 4 },
    { month: "Mar", approvals: 18, rejections: 3, underReview: 6 },
    { month: "Apr", approvals: 22, rejections: 2, underReview: 3 },
    { month: "May", approvals: 25, rejections: 3, underReview: 5 },
    { month: "Jun", approvals: 28, rejections: 2, underReview: 2 },
  ];

  const manufacturerByCountry = useMemo(() => {
    const data: Record<string, number> = {};
    manufacturers.forEach((mfr) => {
      data[mfr.country] = (data[mfr.country] || 0) + 1;
    });
    return Object.entries(data)
      .map(([country, count]) => ({ name: country, value: count }))
      .slice(0, 6);
  }, []);

  const COLORS = [
    "#3b82f6",
    "#ef4444",
    "#f59e0b",
    "#8b5cf6",
    "#10b981",
    "#06b6d4",
    "#ec4899",
  ];

  return (
    <div className="canvas-bg min-h-screen flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-8">
        {/* Hero Summary */}
        <div className="surface-panel">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <p className="text-3xl lg:text-4xl font-semibold text-gray-900">
                {kpis.totalMedicines}
              </p>
              <p className="text-sm font-medium text-gray-600 mt-2">
                Registered Medicines
              </p>
            </div>
            <div>
              <p className="text-3xl lg:text-4xl font-semibold text-gray-900">
                {kpis.inspectionsConducted}
              </p>
              <p className="text-sm font-medium text-gray-600 mt-2">Inspections</p>
            </div>
            <div>
              <p className="text-3xl lg:text-4xl font-semibold text-gray-900">
                {kpis.batchesTracked}
              </p>
              <p className="text-sm font-medium text-gray-600 mt-2">Batches Tracked</p>
            </div>
            <div>
              <p className="text-3xl lg:text-4xl font-semibold text-gray-900">
                {laboratoryTests.length}
              </p>
              <p className="text-sm font-medium text-gray-600 mt-2">Lab Tests</p>
            </div>
          </div>
        </div>

        {/* Key Metrics Section */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Key Metrics
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <KPICard
              icon={Pill}
              label="Registered"
              value={kpis.totalMedicines}
              color="#3b82f6"
              trend="5 new"
            />
            <KPICard
              icon={Clock}
              label="Under Review"
              value={kpis.underReview}
              color="#f59e0b"
              trend="15 days"
            />
            <KPICard
              icon={AlertTriangle}
              label="Recalls"
              value={kpis.activeRecalls}
              color="#ef4444"
              trend="1 resolved"
            />
            <KPICard
              icon={Building2}
              label="Manufacturers"
              value={kpis.totalManufacturers}
              color="#8b5cf6"
              trend="all active"
            />
            <KPICard
              icon={ClipboardList}
              label="Inspections"
              value={kpis.inspectionsConducted}
              color="#06b6d4"
              trend="100%"
            />
            <KPICard
              icon={Package}
              label="Batches"
              value={kpis.batchesTracked}
              color="#10b981"
              trend="95%"
            />
          </div>
        </div>

        {/* Analytics Section */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Analytics</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="surface-panel space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Pill size={18} className="text-blue-600" />
                Medicines by Class
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={therapeuticData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="category"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e2e8f0",
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="#3b82f6"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="surface-panel space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <TrendingUp size={18} className="text-green-600" />
                Approval Trends
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={approvalTrendData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f1f5f9"
                  />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e2e8f0",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line
                    type="monotone"
                    dataKey="approvals"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: "#10b981", r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="rejections"
                    stroke="#ef4444"
                    strokeWidth={3}
                    dot={{ fill: "#ef4444", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Activity
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="surface-panel overflow-hidden">
              <div className="pb-4 border-b border-gray-200 mb-4">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-green-600" />
                  Latest Approvals
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm table-zebra table-sticky-header">
                  <thead className="sticky top-0 bg-white z-10">
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">
                        Medicine
                      </th>
                      <th className="text-left py-3 px-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">
                        Manufacturer
                      </th>
                      <th className="text-left py-3 px-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentApprovals.map((app) => (
                      <tr
                        key={app.id}
                        className="odd:bg-white even:bg-gray-50 hover:bg-blue-50/40 transition-colors"
                      >
                        <td className="py-3 px-3 font-medium text-gray-900 max-w-xs truncate">
                          {app.medicineName}
                        </td>
                        <td className="py-3 px-3 text-gray-600 max-w-sm truncate">
                          {app.manufacturerName.split(" ")[0]}
                        </td>
                        <td className="py-3 px-3 text-gray-600 text-sm">
                          {formatDate(app.approvalDate)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="surface-panel overflow-hidden">
              <div className="pb-4 border-b border-gray-200 mb-4">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <ClipboardList size={18} className="text-blue-600" />
                  Inspection Reports
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm table-zebra table-sticky-header">
                  <thead className="sticky top-0 bg-white z-10">
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">
                        Facility
                      </th>
                      <th className="text-left py-3 px-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">
                        Findings
                      </th>
                      <th className="text-left py-3 px-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentInspections.map((insp) => (
                      <tr
                        key={insp.id}
                        className="odd:bg-white even:bg-gray-50 hover:bg-blue-50/40 transition-colors"
                      >
                        <td className="py-3 px-3 font-medium text-gray-900 max-w-xs truncate">
                          {insp.facilityName.split(" ")[0]}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded ${
                              insp.findingsSeverity === "none"
                                ? "bg-green-100 text-green-700"
                                : insp.findingsSeverity === "critical"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {insp.findingsSeverity.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-gray-600 text-sm">
                          {formatDate(insp.completionDate)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Safety Alerts Section */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Safety Alerts</h2>
          </div>
          <div className="surface-panel">
            <div className="space-y-3">
              {recentAlerts.slice(0, 4).map((alert) => (
                <div
                  key={alert.id}
                  className={`card-elevated p-4 ${
                    alert.recallLevel === "Class I"
                      ? "border-l-4 border-red-500 bg-red-50/30"
                      : alert.recallLevel === "Class II"
                        ? "border-l-4 border-orange-500 bg-orange-50/30"
                        : "border-l-4 border-yellow-500 bg-yellow-50/30"
                  }`}
                >
                  <p className="font-semibold text-gray-900 text-sm">
                    {alert.medicineName}
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    {alert.details.substring(0, 60)}...
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {formatDate(alert.issueDate)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
