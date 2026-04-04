"use client";

import { useState, useMemo } from "react";
import {
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { documents } from "@/lib/extended-data";
import { formatDate } from "@/lib/dateUtils";

const documentTypeColors: Record<string, { bg: string; text: string; label: string }> = {
  certificate: { bg: "bg-blue-100", text: "text-blue-700", label: "Certificate" },
  analysis: { bg: "bg-purple-100", text: "text-purple-700", label: "Analysis" },
  gmp: { bg: "bg-green-100", text: "text-green-700", label: "GMP" },
  approval: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Approval" },
  "inspection-report": { bg: "bg-red-100", text: "text-red-700", label: "Inspection" },
  "lab-report": { bg: "bg-indigo-100", text: "text-indigo-700", label: "Lab Report" },
  "quality-assurance": { bg: "bg-cyan-100", text: "text-cyan-700", label: "QA" },
  other: { bg: "bg-gray-100", text: "text-gray-700", label: "Other" },
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "approved":
      return (
        <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">
          <CheckCircle size={14} />
          Approved
        </div>
      );
    case "pending-approval":
      return (
        <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-semibold">
          <Clock size={14} />
          Pending
        </div>
      );
    case "rejected":
      return (
        <div className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-semibold">
          <AlertCircle size={14} />
          Rejected
        </div>
      );
    default:
      return (
        <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-semibold">
          <Clock size={14} />
          {status}
        </div>
      );
  }
};

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string | "all">("all");
  const [filterStatus, setFilterStatus] = useState<string | "all">("all");
  const [selectedDocument, setSelectedDocument] = useState<typeof documents[0] | null>(null);

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch =
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.linkedTo.entityName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = filterType === "all" || doc.type === filterType;
      const matchesStatus = filterStatus === "all" || doc.status === filterStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [searchTerm, filterType, filterStatus]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="p-6 lg:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <FileText size={32} className="text-blue-600" />
          Document Management
        </h1>
        <p className="text-gray-600 mt-2">
          Manage regulatory documents linked to medicines, manufacturers, and inspections
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Documents List */}
        <div className="lg:col-span-2">
          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow p-6 mb-6 border border-gray-100">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Search Documents
                </label>
                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-3 top-3 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Document name, entity..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Document Type
                  </label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="all">All Types</option>
                    {Object.entries(documentTypeColors).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="approved">Approved</option>
                    <option value="pending-approval">Pending</option>
                    <option value="rejected">Rejected</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Documents Table */}
          <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-6 py-4 font-semibold text-gray-700">
                      Document
                    </th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-700">
                      Type
                    </th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-700">
                      Linked To
                    </th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-700">
                      Upload Date
                    </th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.length > 0 ? (
                    filteredDocuments.map((doc) => {
                      const typeInfo = documentTypeColors[doc.type];
                      return (
                        <tr
                          key={doc.id}
                          className="border-b border-gray-100 hover:bg-blue-50 transition-colors cursor-pointer"
                          onClick={() => setSelectedDocument(doc)}
                        >
                          <td className="px-6 py-4">
                            <p className="font-semibold text-gray-900">{doc.name}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              v{doc.version} • {formatFileSize(doc.fileSize)}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded text-xs font-semibold ${typeInfo.bg} ${typeInfo.text}`}>
                              {typeInfo.label}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-gray-900 font-medium text-sm">
                              {doc.linkedTo.entityName}
                            </p>
                            <p className="text-xs text-gray-500 capitalize">
                              {doc.linkedTo.entityType}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            {getStatusBadge(doc.status)}
                          </td>
                          <td className="px-6 py-4 text-gray-600 text-sm">
                            {formatDate(doc.uploadDate)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button className="p-2 text-blue-600 hover:bg-blue-100 rounded transition">
                                <Eye size={16} />
                              </button>
                              <button className="p-2 text-green-600 hover:bg-green-100 rounded transition">
                                <Download size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <p className="text-gray-600">No documents found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Document Preview Panel */}
        <div>
          <div className="bg-white rounded-lg shadow border border-gray-100 sticky top-24">
            {selectedDocument ? (
              <div>
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="font-semibold text-gray-900">Document Preview</h3>
                </div>
                <div className="p-6">
                  {/* Document Icon */}
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                      <FileText size={32} className="text-blue-600" />
                    </div>
                  </div>

                  {/* Document Info */}
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase">Document Name</p>
                      <p className="text-gray-900 font-semibold mt-1">{selectedDocument.name}</p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase">Type</p>
                      <span className={`inline-block mt-1 px-3 py-1 rounded text-xs font-semibold ${documentTypeColors[selectedDocument.type].bg} ${documentTypeColors[selectedDocument.type].text}`}>
                        {documentTypeColors[selectedDocument.type].label}
                      </span>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase">Linked To</p>
                      <div className="mt-1 p-3 bg-gray-50 rounded border border-gray-200">
                        <p className="text-sm font-medium text-gray-900">
                          {selectedDocument.linkedTo.entityName}
                        </p>
                        <p className="text-xs text-gray-500 capitalize mt-1">
                          {selectedDocument.linkedTo.entityType}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase">Status</p>
                      <div className="mt-2">{getStatusBadge(selectedDocument.status)}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">Uploaded</p>
                        <p className="text-sm text-gray-900 mt-1">
                          {formatDate(selectedDocument.uploadDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">Version</p>
                        <p className="text-sm text-gray-900 mt-1">v{selectedDocument.version}</p>
                      </div>
                    </div>

                    {selectedDocument.expiryDate && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">Expiry Date</p>
                        <div className="flex items-center gap-2 mt-1 text-orange-600">
                          <Calendar size={14} />
                          <span className="text-sm font-medium">
                            {formatDate(selectedDocument.expiryDate)}
                          </span>
                        </div>
                      </div>
                    )}

                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase">File Size</p>
                      <p className="text-sm text-gray-900 mt-1">
                        {formatFileSize(selectedDocument.fileSize)}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2 pt-4 border-t border-gray-200">
                      <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2">
                        <Eye size={16} />
                        View Document
                      </button>
                      <button className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2">
                        <Download size={16} />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center">
                <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600">Select a document to view preview</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <p className="text-gray-600 text-sm font-semibold mb-2">Total Documents</p>
          <p className="text-3xl font-bold text-gray-900">{documents.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <p className="text-gray-600 text-sm font-semibold mb-2">Approved</p>
          <p className="text-3xl font-bold text-green-600">
            {documents.filter((d) => d.status === "approved").length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <p className="text-gray-600 text-sm font-semibold mb-2">Pending Approval</p>
          <p className="text-3xl font-bold text-yellow-600">
            {documents.filter((d) => d.status === "pending-approval").length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <p className="text-gray-600 text-sm font-semibold mb-2">Total Size</p>
          <p className="text-3xl font-bold text-blue-600">
            {formatFileSize(documents.reduce((sum, d) => sum + d.fileSize, 0))}
          </p>
        </div>
      </div>
    </div>
  );
}
