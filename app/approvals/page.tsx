"use client";

import { useState, useMemo } from "react";
import { regulatoryApprovals } from "@/lib/data";
import { formatDate } from "@/lib/dateUtils";
import { Search, CalendarDays, FileCheck } from "lucide-react";

export default function ApprovalsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredApprovals = useMemo(() => {
    return regulatoryApprovals.filter(
      (approval) =>
        (filterStatus === "all" || approval.status === filterStatus) &&
        (approval.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          approval.manufacturerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          approval.approvalNumber.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, filterStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "under-review":
        return "bg-blue-100 text-blue-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "withdrawn":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const stats = {
    total: regulatoryApprovals.length,
    approved: regulatoryApprovals.filter((a) => a.status === "approved").length,
    pending: regulatoryApprovals.filter((a) => a.status === "pending").length,
    underReview: regulatoryApprovals.filter((a) => a.status === "under-review").length,
  };

  return (
    <div className="p-4 lg:p-8 bg-slate-50">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Regulatory Approvals</h1>
        <p className="text-gray-600 mt-2">Medicine registration and approval tracking</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">Approved</p>
          <p className="text-3xl font-bold mt-2">{stats.approved}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
          <p className="text-gray-600 text-sm">Pending</p>
          <p className="text-3xl font-bold mt-2">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm">Under Review</p>
          <p className="text-3xl font-bold mt-2">{stats.underReview}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <p className="text-gray-600 text-sm">Total</p>
          <p className="text-3xl font-bold mt-2">{stats.total}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search approvals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="under-review">Under Review</option>
            <option value="rejected">Rejected</option>
            <option value="withdrawn">Withdrawn</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Approval #</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Medicine</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Manufacturer</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Applied</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Approved</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredApprovals.map((approval) => (
                <tr key={approval.id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-mono text-sm text-gray-900">{approval.approvalNumber}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{approval.medicineName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{approval.manufacturerName}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                      {approval.approvalType.replace("-", " ").toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{formatDate(approval.applicationDate)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {approval.approvalDate ? formatDate(approval.approvalDate) : "-"}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(approval.status)}`}>
                      {approval.status.charAt(0).toUpperCase() + approval.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredApprovals.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <p>No approvals found</p>
          </div>
        )}
      </div>
    </div>
  );
}
