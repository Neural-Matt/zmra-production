"use client";

import { useState, useMemo } from "react";
import { formatDate } from "@/lib/dateUtils";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import {
  AlertTriangle, CheckCircle, Clock, TrendingUp, Package, Building2, Pill,
  ClipboardList, Beaker, AlertCircle, CheckCircle2,
} from "lucide-react";
import {
  medicines, manufacturers, batches, inspections, laboratoryTests, safetyAlerts, regulatoryApprovals,
} from "@/lib/data";

const KPICard = ({ icon: Icon, label, value, color, trend }: any) => (
  <div className="card-base p-6">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{label}</p>
        <p className="text-3xl lg:text-4xl font-bold text-gray-900 mt-3">{value}</p>
        {trend && <p className="text-xs text-green-600 font-semibold mt-2">↑ {trend}</p>}
      </div>
      <div className="p-3 rounded-xl" style={{ backgroundColor: `${color}15` }}>
        <Icon size={28} style={{ color }} />
      </div>
    </div>
  </div>
);

const chartData = {
  approvalTrend: [
    { month: "Jan", approvals: 12, rejections: 2, underReview: 5 },
    { month: "Feb", approvals: 15, rejections: 1, underReview: 4 },
    { month: "Mar", approvals: 18, rejections: 3, underReview: 6 },
    { month: "Apr", approvals: 22, rejections: 2, underReview: 3 },
    { month: "May", approvals: 25, rejections: 3, underReview: 5 },
    { month: "Jun", approvals: 28, rejections: 2, underReview: 2 },
  ],
  therapeutic: [
    { category: "Antibiotics", count: 8 },
    { category: "Cardiovascular", count: 7 },
    { category: "Gastrointestinal", count: 5 },
    { category: "Psychiatric", count: 3 },
    { category: "Analgesics", count: 4 },
    { category: "Antiretrovirals", count: 4 },
    { category: "Antimalarials", count: 4 },
  ],
};

const COLORS = ["#3b82f6", "#ef4444", "#f59e0b", "#8b5cf6", "#10b981", "#06b6d4", "#ec4899"];

export default function Dashboard() {
  const kpis = useMemo(() => ({
    totalMedicines: medicines.length,
    underReview: medicines.filter((m) => m.status === "pending").length,
    activeRecalls: safetyAlerts.filter((a) => a.status === "active").length,
    totalManufacturers: manufacturers.filter((m) => m.status === "active").length,
    inspectionsConducted: inspections.filter((i) => i.status === "completed").length,
    batchesTracked: batches.length,
  }), []);

  const manufacturerByCountry = useMemo(() => {
    const data: Record<string, number> = {};
    manufacturers.forEach((mfr) => {
      data[mfr.country] = (data[mfr.country] || 0) + 1;
    });
    return Object.entries(data).map(([country, count]) => ({ name: country, value: count })).slice(0, 6);
  }, []);

  const complianceStats = useMemo(() => {
    const completed = inspections.filter((i) => i.status === "completed");
    const noFindings = completed.filter((i) => i.findingsSeverity === "none").length;
    return {
      rate: completed.length > 0 ? Math.round((noFindings / completed.length) * 100) : 0,
      total: completed.length,
      compliant: noFindings,
    };
  }, []);

  const recentApprovals = regulatoryApprovals
    .filter((a) => a.status === "approved")
    .sort((a, b) => new Date(b.approvalDate).getTime() - new Date(a.approvalDate).getTime())
    .slice(0, 5);

  const recentInspections = inspections
    .filter((i) => i.status === "completed")
    .sort((a, b) => new Date(b.completionDate).getTime() - new Date(a.completionDate).getTime())
    .slice(0, 5);

  const recentAlerts = safetyAlerts
    .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-50 p-6 lg:p-8">
      <div className="space-y-8">
        {/* Hero Summary */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 lg:p-12 shadow-lg-light">
          <div className="relative z-10">
            <h1 className="text-4xl font-bold text-white mb-2">Regulatory Dashboard</h1>
            <p className="text-blue-100 mb-8">National Medicines Management System</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-white">
                <p className="text-4xl font-bold">{kpis.totalMedicines}</p>
                <p className="text-sm text-blue-100 mt-1">Registered Medicines</p>
              </div>
              <div className="text-white">
                <p className="text-4xl font-bold">{kpis.inspectionsConducted}</p>
                <p className="text-sm text-blue-100 mt-1">Inspections</p>
              </div>
              <div className="text-white">
                <p className="text-4xl font-bold">{kpis.batchesTracked}</p>
                <p className="text-sm text-blue-100 mt-1">Batches Tracked</p>
              </div>
              <div className="text-white">
                <p className="text-4xl font-bold">{laboratoryTests.length}</p>
                <p className="text-sm text-blue-100 mt-1">Lab Tests</p>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Key Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <KPICard icon={Pill} label="Registered" value={kpis.totalMedicines} color="#3b82f6" trend="5 new" />
            <KPICard icon={Clock} label="Under Review" value={kpis.underReview} color="#f59e0b" trend="15 days" />
            <KPICard icon={AlertTriangle} label="Recalls" value={kpis.activeRecalls} color="#ef4444" trend="1 resolved" />
            <KPICard icon={Building2} label="Manufacturers" value={kpis.totalManufacturers} color="#8b5cf6" trend="all active" />
            <KPICard icon={ClipboardList} label="Inspections" value={kpis.inspectionsConducted} color="#06b6d4" trend="100%" />
            <KPICard icon={Package} label="Batches" value={kpis.batchesTracked} color="#10b981" trend="95%" />
          </div>
        </div>

        {/* Charts */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Analytics</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card-base p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Pill size={20} className="text-blue-600" />
                Medicines by Class
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.therapeutic}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0" }} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="card-base p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <TrendingUp size={20} className="text-green-600" />
                Approval Trends
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData.approvalTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0" }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="approvals" stroke="#10b981" strokeWidth={3} dot={{ fill: "#10b981", r: 4 }} />
                  <Line type="monotone" dataKey="rejections" stroke="#ef4444" strokeWidth={3} dot={{ fill: "#ef4444", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Distribution & Compliance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card-base p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Building2 size={20} className="text-purple-600" />
              Manufacturers by Country
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={manufacturerByCountry} cx="50%" cy="50%" innerRadius={60} outerRadius={100} fill="#8884d8" dataKey="value">
                  {manufacturerByCountry.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="card-base p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <CheckCircle size={20} className="text-cyan-600" />
              Compliance Rate
            </h3>
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="56" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                  <circle cx="64" cy="64" r="56" fill="none" stroke="#10b981" strokeWidth="8" 
                    strokeDasharray={`${(complianceStats.rate / 100) * 351.86} 351.86`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-3xl font-bold text-gray-900">{complianceStats.rate}%</p>
                  <p className="text-xs text-gray-500 mt-1">Compliant</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-900">{complianceStats.compliant} of {complianceStats.total} inspections</p>
                <p className="text-xs text-gray-500 mt-1">No critical findings</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="table-container">
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-50">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-green-600" />
                  Latest Approvals
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="table-header">
                    <tr>
                      <th className="table-header-cell">Medicine</th>
                      <th className="table-header-cell">Manufacturer</th>
                      <th className="table-header-cell">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentApprovals.map((app, i) => (
                      <tr key={app.id} className={`table-row ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                        <td className="table-cell font-medium text-gray-900 max-w-xs truncate">{app.medicineName}</td>
                        <td className="table-cell text-gray-600 max-w-sm truncate">{app.manufacturerName.split(" ")[0]}</td>
                        <td className="table-cell text-gray-500">{formatDate(app.approvalDate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="table-container">
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-50">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <ClipboardList size={18} className="text-blue-600" />
                  Inspection Reports
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="table-header">
                    <tr>
                      <th className="table-header-cell">Facility</th>
                      <th className="table-header-cell">Findings</th>
                      <th className="table-header-cell">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentInspections.map((insp, i) => (
                      <tr key={insp.id} className={`table-row ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                        <td className="table-cell font-medium text-gray-900 max-w-xs truncate">{insp.facilityName.split(" ")[0]}</td>
                        <td className="table-cell">
                          <span className={insp.findingsSeverity === "none" ? "badge-success" : insp.findingsSeverity === "critical" ? "badge-danger" : "badge-warning"}>
                            {insp.findingsSeverity.toUpperCase()}
                          </span>
                        </td>
                        <td className="table-cell text-gray-500">{formatDate(insp.completionDate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="card-base p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle size={20} className="text-red-600" />
            Safety Alerts
          </h3>
          <div className="space-y-3">
            {recentAlerts.slice(0, 4).map((alert) => (
              <div key={alert.id} className={`p-4 border-l-4 rounded-lg transition-smooth ${
                alert.recallLevel === "Class I" ? "bg-red-50 border-red-400" :
                alert.recallLevel === "Class II" ? "bg-orange-50 border-orange-400" : "bg-yellow-50 border-yellow-400"
              }`}>
                <p className="font-semibold text-gray-900 text-sm">{alert.medicineName}</p>
                <p className="text-xs text-gray-600 mt-1">{alert.details.substring(0, 60)}...</p>
                <p className="text-xs text-gray-500 mt-2">{formatDate(alert.issueDate)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
