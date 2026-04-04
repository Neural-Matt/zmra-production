'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

interface Medicine {
  id: string;
  brandName: string;
  genericName: string;
  therapeuticCategory: string;
  dosageForm: string;
  strength: string;
  manufacturer: string;
  manufacturerCountry: string;
  approvalStatus: string;
  images: {
    productImage: string;
  };
}

interface ApiResponse {
  medicines: Medicine[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
  metadata?: {
    totalMedicines: number;
  };
}

export default function MedicinesPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState<string[]>(['all']);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<ApiResponse['pagination'] | null>(null);

  // Fetch medicines with pagination and filters
  useEffect(() => {
    const fetchMedicines = async () => {
      setIsLoading(true);
      try {
        // Build query parameters
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: ITEMS_PER_PAGE.toString(),
        });

        if (searchTerm) params.append('search', searchTerm);
        if (selectedCategory !== 'all') params.append('category', selectedCategory);

        const response = await fetch(`/api/medicines?${params.toString()}`);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data: ApiResponse = await response.json();

        if (!data.medicines || !Array.isArray(data.medicines)) {
          throw new Error('Invalid data structure: medicines is not an array');
        }

        setMedicines(data.medicines);
        setPagination(data.pagination);

        // Extract unique categories from metadata or medicines
        if (data.medicines.length > 0) {
          const uniqueCategories = ['all', ...new Set(data.medicines.map((m) => m.therapeuticCategory))];
          setCategories(uniqueCategories as string[]);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching medicines:', error);
        setMedicines([]);
        setPagination(null);
        setIsLoading(false);
      }
    };

    fetchMedicines();
  }, [currentPage, searchTerm, selectedCategory]);

  const handlePageChange = (page: number) => {
    if (pagination && page >= 1 && page <= pagination.totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSearch = (search: string) => {
    setSearchTerm(search);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page on filter change
  };

  return (
    <div className="canvas-bg min-h-screen flex-1 overflow-auto">
      {isLoading && medicines.length === 0 ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading medicines...</p>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">Medicines Registry</h1>
            <p className="text-sm text-gray-600">
              Browse and manage all registered pharmaceutical products
            </p>
          </div>

          {/* Search & Filter Section */}
          <div className="surface-panel mb-6">
            <div className="relative mb-6">
              <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by medicine name or generic name..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>

            {/* Filter */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Therapeutic Class
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2 flex items-end">
                <div className="text-sm text-gray-600">
                  {pagination && (
                    <>
                      Showing <span className="font-semibold">{medicines.length}</span> of{' '}
                      <span className="font-semibold">{pagination.total}</span> medicines
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Medicines Table */}
          {medicines.length > 0 ? (
            <div className="surface-panel overflow-hidden">
              <table className="min-w-full table-zebra table-sticky-header">
                <thead className="sticky top-0 bg-white z-10">
                  <tr className="border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Image
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Generic Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Class
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Manufacturer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Country
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Dosage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Strength
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Status
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {medicines.map((medicine) => (
                    <tr
                      key={medicine.id}
                      className="odd:bg-white even:bg-gray-50 hover:bg-blue-50/40 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200 flex-shrink-0 flex items-center justify-center">
                          {medicine.images?.productImage ? (
                            <img
                              src={medicine.images.productImage}
                              alt={medicine.brandName}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : (
                            <span className="text-xs text-gray-400">No image</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900 text-sm">
                        {medicine.brandName}
                      </td>
                      <td className="px-6 py-4 text-gray-700 text-sm">
                        {medicine.genericName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-gray-700 text-sm">
                        {medicine.therapeuticCategory}
                      </td>
                      <td className="px-6 py-4 text-gray-700 text-sm">
                        {medicine.manufacturer}
                      </td>
                      <td className="px-6 py-4 text-gray-700 text-sm">
                        {medicine.manufacturerCountry || 'N/A'}
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
                            medicine.approvalStatus === 'Approved'
                              ? 'bg-green-100 text-green-700'
                              : medicine.approvalStatus === 'Pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {medicine.approvalStatus}
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
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Page <span className="font-semibold">{pagination.page}</span> of{' '}
                <span className="font-semibold">{pagination.totalPages}</span> (
                <span className="font-semibold">{pagination.total}</span> total)
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                      pagination.page === page
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
