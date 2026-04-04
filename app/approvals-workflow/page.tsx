"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  CheckCircle,
  Clock,
  TestTube,
  Users,
  ChevronRight,
  Search,
  Filter,
} from "lucide-react";
import { registrationApplications } from "@/lib/extended-data";

const stages = [
  { id: 1, name: "Submitted", icon: Clock, color: "gray" },
  { id: 2, name: "Technical Screening", icon: Filter, color: "yellow" },
  { id: 3, name: "Laboratory Testing", icon: TestTube, color: "blue" },
  { id: 4, name: "Evaluation Committee", icon: Users, color: "purple" },
  { id: 5, name: "Approved / Rejected", icon: CheckCircle, color: "green" },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-700 border-green-300";
    case "rejected":
      return "bg-red-100 text-red-700 border-red-300";
    case "evaluation-committee":
      return "bg-purple-100 text-purple-700 border-purple-300";
    case "laboratory-testing":
      return "bg-blue-100 text-blue-700 border-blue-300";
    case "technical-screening":
      return "bg-yellow-100 text-yellow-700 border-yellow-300";
    case "submitted":
      return "bg-gray-100 text-gray-700 border-gray-300";
    default:
      return "bg-gray-100 text-gray-700 border-gray-300";
  }
};

export default function ApprovalsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStage, setFilterStage] = useState<number | "all">("all");

  const filteredApplications = useMemo(() => {
    return registrationApplications.filter((app) => {
      const matchesSearch =
        app.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.manufacturerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.applicationNumber.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStage = filterStage === "all" || app.stage === filterStage;

      return matchesSearch && matchesStage;
    });
  }, [searchTerm, filterStage]);

  // Group applications by stage
  const applicationsByStage = useMemo(() => {
    const grouped: Record<number, typeof registrationApplications> = {};
    stages.forEach((stage) => {
      grouped[stage.id] = registrationApplications.filter((app) => app.stage === stage.id);
    });
    return grouped;
  }, []);

  return (
    <div className="p-6 lg:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <CheckCircle size={32} className="text-blue-600" />
          Regulatory Approval Workflow
        </h1>
        <p className="text-gray-600 mt-2">
          Track medicine registration applications through the approval pipeline
        </p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow p-6 mb-8 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Search Applications
            </label>
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-3 text-gray-400"
              />
              <input
                type="text"
                placeholder="Medicine name, manufacturer, application number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Filter by Stage
            </label>
            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value === "all" ? "all" : parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Stages</option>
              {stages.map((stage) => (
                <option key={stage.id} value={stage.id}>
                  {stage.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Display Mode Selection */}
      <div className="mb-6 text-sm text-gray-600">
        Showing <span className="font-semibold">{filteredApplications.length}</span> of{" "}
        <span className="font-semibold">{registrationApplications.length}</span> applications
      </div>

      {/* Pipeline View */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-8">
        {stages.map((stage) => {
          const stageApps = applicationsByStage[stage.id] || [];
          const Icon = stage.icon;
          return (
            <div key={stage.id} className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
              <div className={`px-4 py-3 bg-gradient-to-r ${{
                gray: "from-gray-100 to-gray-200",
                yellow: "from-yellow-100 to-yellow-200",
                blue: "from-blue-100 to-blue-200",
                purple: "from-purple-100 to-purple-200",
                green: "from-green-100 to-green-200",
              }[stage.color]}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={18} className={{
                    gray: "text-gray-600",
                    yellow: "text-yellow-600",
                    blue: "text-blue-600",
                    purple: "text-purple-600",
                    green: "text-green-600",
                  }[stage.color]} />
                  <h3 className="font-semibold text-gray-900 text-sm">{stage.name}</h3>
                </div>
                <p className="text-lg font-bold text-gray-900">{stageApps.length}</p>
              </div>
              <div className="p-4 max-h-96 overflow-y-auto">
                {stageApps.length > 0 ? (
                  stageApps.map((app) => (
                    <div
                      key={app.id}
                      className="mb-3 p-3 bg-gray-50 rounded border border-gray-200 hover:border-gray-300 transition cursor-pointer"
                    >
                      <p className="font-semibold text-sm text-gray-900 truncate">
                        {app.medicineName}
                      </p>
                      <p className="text-xs text-gray-600 mt-1 truncate">
                        {app.manufacturerName.split(" ")[0]}
                      </p>
                      <div className="mt-2 text-xs">
                        <span className={`inline-block px-2 py-1 rounded font-semibold ${getStatusColor(app.status)}`}>
                          {app.status.replace("-", " ")}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 text-center py-4">No applications</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Table View */}
      <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="font-semibold text-gray-900">Application Details</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-6 py-4 font-semibold text-gray-700">
                  Application
                </th>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">
                  Medicine
                </th>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">
                  Manufacturer
                </th>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">
                  Submitted
                </th>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">
                  Reviewer
                </th>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">
                  Status
                </th>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.length > 0 ? (
                filteredApplications.map((app) => (
                  <tr
                    key={app.id}
                    className="border-b border-gray-100 hover:bg-blue-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900 text-sm">
                        {app.applicationNumber}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900 font-medium">{app.medicineName}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {app.manufacturerName.split(" ")[0]}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {new Date(app.submissionDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {app.assignedReviewer}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(app.status)}`}>
                        {app.status.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/approvals/${app.id}`}
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        View
                        <ChevronRight size={16} />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <p className="text-gray-600">No applications found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <p className="text-gray-600 text-sm font-semibold mb-2">Total Applications</p>
          <p className="text-3xl font-bold text-gray-900">{registrationApplications.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <p className="text-gray-600 text-sm font-semibold mb-2">Approved</p>
          <p className="text-3xl font-bold text-green-600">
            {registrationApplications.filter((a) => a.status === "approved").length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <p className="text-gray-600 text-sm font-semibold mb-2">Under Review</p>
          <p className="text-3xl font-bold text-yellow-600">
            {registrationApplications.filter((a) => ["submitted", "technical-screening", "laboratory-testing", "evaluation-committee"].includes(a.status)).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <p className="text-gray-600 text-sm font-semibold mb-2">Rejected</p>
          <p className="text-3xl font-bold text-red-600">
            {registrationApplications.filter((a) => a.status === "rejected").length}
          </p>
        </div>
      </div>
    </div>
  );
}
