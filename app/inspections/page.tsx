'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { inspections } from '@/lib/data';
import { Search, AlertTriangle, CheckCircle, AlertCircle, BarChart3 } from 'lucide-react';

const ITEMS_PER_PAGE = 15;

export default function InspectionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFacilityType, setSelectedFacilityType] = useState('all');
  const [selectedComplianceStatus, setSelectedComplianceStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate summary statistics
  const summary = useMemo(() => {
    const total = inspections.length;
    const compliant = inspections.filter((i) => i.complianceStatus === 'compliant').length;
    const warning = inspections.filter((i) => i.complianceStatus === 'warning').length;
    const critical = inspections.filter((i) => i.complianceStatus === 'critical').length;
    const avgScore =
      inspections.length > 0
        ? Math.round(inspections.reduce((sum, i) => sum + i.complianceScore, 0) / inspections.length)
        : 0;

    return { total, compliant, warning, critical, avgScore };
  }, []);

  // Filter inspections
  const filteredInspections = useMemo(() => {
    return inspections.filter((inspection) => {
      const matchesSearch =
        inspection.facilityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inspection.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inspection.inspectorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inspection.inspectionNumber.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFacilityType =
        selectedFacilityType === 'all' || inspection.facilityType === selectedFacilityType;

      const matchesCompliance =
        selectedComplianceStatus === 'all' ||
        inspection.complianceStatus === selectedComplianceStatus;

      return matchesSearch && matchesFacilityType && matchesCompliance;
    });
  }, [searchTerm, selectedFacilityType, selectedComplianceStatus]);

  // Pagination
  const totalPages = Math.ceil(filteredInspections.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedInspections = filteredInspections.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const getComplianceIcon = (status: string) => {
    if (status === 'compliant') return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (status === 'warning') return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    return <AlertTriangle className="w-5 h-5 text-red-600" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Inspections & Compliance</h1>
          <p className="text-gray-600">
            Monitor facility inspections across pharmacies, hospitals, distributors, and manufacturers
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">Total Inspections</p>
                <p className="text-3xl font-bold text-gray-900">{summary.total}</p>
              </div>
              <BarChart3 className="w-10 h-10 text-blue-100" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">Compliant</p>
                <p className="text-3xl font-bold text-green-600">{summary.compliant}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-100" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">Warning</p>
                <p className="text-3xl font-bold text-yellow-600">{summary.warning}</p>
              </div>
              <AlertCircle className="w-10 h-10 text-yellow-100" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">Critical</p>
                <p className="text-3xl font-bold text-red-600">{summary.critical}</p>
              </div>
              <AlertTriangle className="w-10 h-10 text-red-100" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">Avg Score</p>
                <p className="text-3xl font-bold text-indigo-600">{summary.avgScore}%</p>
              </div>
              <div className="w-10 h-10 bg-indigo-100 rounded-lg"></div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by facility name, location, inspector, or inspection number..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Facility Type
              </label>
              <select
                value={selectedFacilityType}
                onChange={(e) => {
                  setSelectedFacilityType(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Facility Types</option>
                <option value="pharmacy">Pharmacy</option>
                <option value="hospital">Hospital</option>
                <option value="distributor">Distributor</option>
                <option value="manufacturer">Manufacturer</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Compliance Status
              </label>
              <select
                value={selectedComplianceStatus}
                onChange={(e) => {
                  setSelectedComplianceStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="compliant">Compliant</option>
                <option value="warning">Warning</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600">
          Showing <span className="font-semibold">{paginatedInspections.length}</span> of{' '}
          <span className="font-semibold">{filteredInspections.length}</span> inspections
        </div>

        {/* Inspections Table */}
        {paginatedInspections.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Facility Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Location</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Inspection Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Inspector</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">Score</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">Status</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedInspections.map((inspection) => (
                    <tr
                      key={inspection.id}
                      className={`transition-colors ${
                        inspection.complianceStatus === 'critical'
                          ? 'bg-red-50 hover:bg-red-100'
                          : inspection.complianceStatus === 'warning'
                            ? 'bg-yellow-50 hover:bg-yellow-100'
                            : 'hover:bg-green-50'
                      }`}
                    >
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {inspection.facilityName}
                      </td>
                      <td className="px-6 py-4 text-gray-700 text-sm">
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold capitalize">
                          {inspection.facilityType}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700 text-sm">{inspection.location}</td>
                      <td className="px-6 py-4 text-gray-700 text-sm">
                        {inspection.inspectionDate}
                      </td>
                      <td className="px-6 py-4 text-gray-700 text-sm">
                        {inspection.inspectorName}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-bold text-lg text-gray-900">
                          {inspection.complianceScore}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {getComplianceIcon(inspection.complianceStatus)}
                          <span
                            className={`text-sm font-semibold capitalize ${
                              inspection.complianceStatus === 'compliant'
                                ? 'text-green-600'
                                : inspection.complianceStatus === 'warning'
                                  ? 'text-yellow-600'
                                  : 'text-red-600'
                            }`}
                          >
                            {inspection.complianceStatus}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Link href={`/inspections/${inspection.id}`}>
                          <button className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors text-sm font-medium">
                            View
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No inspections found matching your criteria</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Page <span className="font-semibold">{currentPage}</span> of{' '}
              <span className="font-semibold">{totalPages}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let page = i + 1;
                if (totalPages > 5 && currentPage > 3) {
                  page = currentPage - 2 + i;
                }
                if (page <= totalPages) {
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-indigo-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                }
                return null;
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
