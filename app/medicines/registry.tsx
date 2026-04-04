'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { medicines } from '@/lib/data';
import { Search, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

export default function MedicinesRegistry() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedManufacturer, setSelectedManufacturer] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Get unique categories and manufacturers
  const categories = useMemo(
    () => ['all', ...new Set(medicines.map((m) => m.therapeuticCategory))],
    []
  );
  const manufacturers = useMemo(
    () => ['all', ...new Set(medicines.map((m) => m.manufacturer))],
    []
  );

  // Filter medicines
  const filteredMedicines = useMemo(() => {
    return medicines.filter((medicine) => {
      const matchesSearch =
        medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medicine.genericName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medicine.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || medicine.therapeuticCategory === selectedCategory;
      const matchesManufacturer =
        selectedManufacturer === 'all' || medicine.manufacturer === selectedManufacturer;
      const matchesStatus = selectedStatus === 'all' || medicine.status === selectedStatus;

      return (
        matchesSearch && matchesCategory && matchesManufacturer && matchesStatus
      );
    });
  }, [searchTerm, selectedCategory, selectedManufacturer, selectedStatus]);

  // Pagination
  const totalPages = Math.ceil(filteredMedicines.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedMedicines = filteredMedicines.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Medicines Registry</h1>
          <p className="text-gray-600">
            Browse and manage all registered pharmaceutical products
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by medicine name, generic name, or manufacturer..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Filter Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Therapeutic Class
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Manufacturer
              </label>
              <select
                value={selectedManufacturer}
                onChange={(e) => {
                  setSelectedManufacturer(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {manufacturers.map((mfr) => (
                  <option key={mfr} value={mfr}>
                    {mfr === 'all' ? 'All Manufacturers' : mfr}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status
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
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="recalled">Recalled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600">
          Showing <span className="font-semibold">{paginatedMedicines.length}</span> of{' '}
          <span className="font-semibold">{filteredMedicines.length}</span> medicines
        </div>

        {/* Medicines Table */}
        {paginatedMedicines.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Image</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Generic Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Class</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Manufacturer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Country</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Dosage</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Strength</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedMedicines.map((medicine) => (
                  <tr
                    key={medicine.id}
                    className="hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center text-xs font-semibold text-blue-700">
                        {medicine.name.substring(0, 2).toUpperCase()}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {medicine.name}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {medicine.genericName || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-gray-700 text-sm">
                      {medicine.therapeuticCategory}
                    </td>
                    <td className="px-6 py-4 text-gray-700 text-sm">
                      {medicine.manufacturer}
                    </td>
                    <td className="px-6 py-4 text-gray-700 text-sm">
                      {medicine.country || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-gray-700 text-sm">
                      {medicine.dosageForm}
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-medium">
                      {medicine.strength}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          medicine.status === 'approved'
                            ? 'bg-green-100 text-green-700'
                            : medicine.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {medicine.status.charAt(0).toUpperCase() + medicine.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link href={`/medicines/${medicine.id}`}>
                        <button className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition-colors inline-flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span className="text-xs font-medium">View</span>
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No medicines found matching your criteria</p>
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
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Items per page:</label>
              <select className="px-2 py-1 border border-gray-300 rounded-lg text-sm" defaultValue="10">
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
