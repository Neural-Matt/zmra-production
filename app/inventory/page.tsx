'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { batches } from '@/lib/data';
import { Search, AlertTriangle, Package, Calendar, TrendingDown } from 'lucide-react';

const ITEMS_PER_PAGE = 15;

// Helper to calculate days until expiry
const calculateDaysUntilExpiry = (expiryDate: string): number => {
  const today = new Date('2026-03-14'); // Current date in app
  const expiry = new Date(expiryDate);
  const timeDiff = expiry.getTime() - today.getTime();
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
};

// Helper to determine expiry status
const getExpiryStatus = (daysUntilExpiry: number): 'expired' | 'soon' | 'normal' => {
  if (daysUntilExpiry <= 0) return 'expired';
  if (daysUntilExpiry <= 90) return 'soon';
  return 'normal';
};

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedExpiryFilter, setSelectedExpiryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate summary statistics
  const summary = useMemo(() => {
    const total = batches.length;
    const available = batches.filter((b) => b.status === 'available').length;
    const reserved = batches.filter((b) => b.status === 'reserved').length;
    const quarantined = batches.filter((b) => b.status === 'quarantined').length;
    const expired = batches.filter((b) => {
      const daysLeft = calculateDaysUntilExpiry(b.expiryDate);
      return daysLeft <= 0;
    }).length;
    const soonToExpire = batches.filter((b) => {
      const daysLeft = calculateDaysUntilExpiry(b.expiryDate);
      return daysLeft > 0 && daysLeft <= 90;
    }).length;

    return { total, available, reserved, quarantined, expired, soonToExpire };
  }, []);

  // Filter batches
  const filteredBatches = useMemo(() => {
    return batches.filter((batch) => {
      const matchesSearch =
        batch.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        batch.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        batch.manufacturerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        batch.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatus === 'all' || batch.status === selectedStatus;

      const daysLeft = calculateDaysUntilExpiry(batch.expiryDate);
      const expiryStatus = getExpiryStatus(daysLeft);

      const matchesExpiry =
        selectedExpiryFilter === 'all' ||
        (selectedExpiryFilter === 'soon' && expiryStatus === 'soon') ||
        (selectedExpiryFilter === 'expired' && expiryStatus === 'expired') ||
        (selectedExpiryFilter === 'normal' && expiryStatus === 'normal');

      return matchesSearch && matchesStatus && matchesExpiry;
    });
  }, [searchTerm, selectedStatus, selectedExpiryFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredBatches.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedBatches = filteredBatches.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Inventory & Batch Tracking</h1>
          <p className="text-gray-600">
            Monitor medicine batches, track expiry dates, and manage inventory
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">Total Batches</p>
                <p className="text-3xl font-bold text-gray-900">{summary.total}</p>
              </div>
              <Package className="w-10 h-10 text-blue-100" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">Available</p>
                <p className="text-3xl font-bold text-green-600">{summary.available}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg"></div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">Reserved</p>
                <p className="text-3xl font-bold text-yellow-600">{summary.reserved}</p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg"></div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">Quarantined</p>
                <p className="text-3xl font-bold text-orange-600">{summary.quarantined}</p>
              </div>
              <AlertTriangle className="w-10 h-10 text-orange-100" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">Soon to Expire</p>
                <p className="text-3xl font-bold text-red-600">{summary.soonToExpire}</p>
              </div>
              <Calendar className="w-10 h-10 text-red-100" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">Expired</p>
                <p className="text-3xl font-bold text-red-700">{summary.expired}</p>
              </div>
              <TrendingDown className="w-10 h-10 text-red-100" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by batch number, medicine name, manufacturer, or location..."
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
                Batch Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
                <option value="quarantined">Quarantined</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Expiry Status
              </label>
              <select
                value={selectedExpiryFilter}
                onChange={(e) => {
                  setSelectedExpiryFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Expiry Status</option>
                <option value="normal">Normal (&gt; 90 days)</option>
                <option value="soon">Soon to Expire (≤ 90 days)</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600">
          Showing <span className="font-semibold">{paginatedBatches.length}</span> of{' '}
          <span className="font-semibold">{filteredBatches.length}</span> batches
        </div>

        {/* Inventory Table */}
        {paginatedBatches.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Batch Number</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Medicine Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Manufacturer</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Manufacturing Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Expiry Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Quantity</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Location</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedBatches.map((batch) => {
                    const daysLeft = calculateDaysUntilExpiry(batch.expiryDate);
                    const expiryStatus = getExpiryStatus(daysLeft);

                    return (
                      <tr
                        key={batch.id}
                        className={`transition-colors ${
                          expiryStatus === 'expired'
                            ? 'bg-red-50 hover:bg-red-100'
                            : expiryStatus === 'soon'
                              ? 'bg-yellow-50 hover:bg-yellow-100'
                              : 'hover:bg-blue-50'
                        }`}
                      >
                        <td className="px-6 py-4 font-semibold text-gray-900">
                          {batch.batchNumber}
                        </td>
                        <td className="px-6 py-4 text-gray-700">{batch.medicineName}</td>
                        <td className="px-6 py-4 text-gray-700 text-sm">
                          {batch.manufacturerName}
                        </td>
                        <td className="px-6 py-4 text-gray-700 text-sm">
                          {batch.manufacturingDate}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          <div className="flex items-center gap-2">
                            <span>{batch.expiryDate}</span>
                            {expiryStatus === 'expired' && (
                              <span className="px-2 py-1 bg-red-200 text-red-700 text-xs font-semibold rounded">
                                Expired
                              </span>
                            )}
                            {expiryStatus === 'soon' && (
                              <span className="px-2 py-1 bg-yellow-200 text-yellow-700 text-xs font-semibold rounded">
                                {daysLeft} days
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {batch.quantity} {batch.unit}
                        </td>
                        <td className="px-6 py-4 text-gray-700 text-sm">{batch.location}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              batch.status === 'available'
                                ? 'bg-green-100 text-green-700'
                                : batch.status === 'reserved'
                                  ? 'bg-blue-100 text-blue-700'
                                  : batch.status === 'quarantined'
                                    ? 'bg-orange-100 text-orange-700'
                                    : batch.status === 'distributed'
                                      ? 'bg-purple-100 text-purple-700'
                                      : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {batch.status.charAt(0).toUpperCase() + batch.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Link href={`/inventory/${batch.id}`}>
                            <button className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors text-sm font-medium">
                              View
                            </button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No batches found matching your criteria</p>
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
                          ? 'bg-blue-600 text-white'
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
