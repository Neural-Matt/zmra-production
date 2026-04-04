'use client';

import { useState, use, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  FileText,
  Pill,
  Package,
  Globe,
  Calendar,
  CheckCircle,
  Download,
  AlertCircle,
  Image as ImageIcon,
} from 'lucide-react';

interface DynamicPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProductProfilePage({ params }: DynamicPageProps) {
  const { id } = use(params);
  const [medicine, setMedicine] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch medicine data
  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        const response = await fetch(`/api/medicines?id=${id}`);
        if (response.ok) {
          const data = await response.json();
          setMedicine(data);
        }
      } catch (error) {
        console.error('Error fetching medicine:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedicine();
  }, [id]);

  if (isLoading) {
    return (
      <div className="canvas-bg min-h-screen flex-1 overflow-auto flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading medicine details...</p>
        </div>
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="canvas-bg min-h-screen flex-1 overflow-auto p-8">
        <div className="max-w-6xl mx-auto">
          <Link href="/medicines" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Medicines
          </Link>
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Medicine Not Found</h2>
            <p className="text-gray-600">The medicine product you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  // Extract batches from medicine
  const medicineBatches = medicine?.batches || [];

  return (
    <div className="canvas-bg min-h-screen flex-1 overflow-auto">
      <div className="max-w-6xl mx-auto p-6 lg:p-8">
        {/* Back Button */}
        <Link href="/medicines" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 font-medium">
          <ArrowLeft className="w-4 h-4" />
          Back to Medicines Registry
        </Link>

        {/* Product Header with Images */}
        <div className="surface-panel mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Main Product Image */}
            <div className="md:col-span-1">
              <div className="bg-gray-100 rounded-xl overflow-hidden h-80 flex items-center justify-center">
                {medicine.images?.productImage ? (
                  <img
                    src={medicine.images.productImage}
                    alt={medicine.brandName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400 flex flex-col items-center gap-2">
                    <ImageIcon className="w-12 h-12" />
                    <span>No image available</span>
                  </div>
                )}
              </div>
            </div>

            {/* Medicine Details */}
            <div className="md:col-span-2">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">{medicine.brandName}</h1>
                  <p className="text-gray-600 text-lg">{medicine.description}</p>
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ml-4 ${
                    medicine.approvalStatus === 'Approved'
                      ? 'bg-green-100 text-green-700'
                      : medicine.approvalStatus === 'Under Review'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {medicine.approvalStatus}
                </span>
              </div>

              {/* Key Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-xs text-gray-600 font-semibold mb-1">Generic Name</p>
                  <p className="text-sm font-bold text-gray-900">{medicine.genericName}</p>
                </div>
                <div className="p-4 bg-indigo-50 rounded-lg">
                  <p className="text-xs text-gray-600 font-semibold mb-1">Strength</p>
                  <p className="text-sm font-bold text-gray-900">{medicine.strength}</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-xs text-gray-600 font-semibold mb-1">Dosage Form</p>
                  <p className="text-sm font-bold text-gray-900">{medicine.dosageForm}</p>
                </div>
                <div className="p-4 bg-pink-50 rounded-lg">
                  <p className="text-xs text-gray-600 font-semibold mb-1">Drug Class</p>
                  <p className="text-sm font-bold text-gray-900">{medicine.drugClass}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex">
              {['overview', 'images', 'documents', 'batches'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                    activeTab === tab
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="p-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Product Information */}
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Pill className="w-6 h-6 text-blue-600" />
                    Product Information
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 font-semibold mb-1">Brand Name</p>
                      <p className="text-gray-900 font-medium">{medicine.brandName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-semibold mb-1">Generic Name</p>
                      <p className="text-gray-900 font-medium">{medicine.genericName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-semibold mb-1">Therapeutic Class</p>
                      <p className="text-gray-900 font-medium">{medicine.therapeuticCategory}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-semibold mb-1">Manufacturer</p>
                      <p className="text-gray-900 font-medium">{medicine.manufacturer}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-semibold mb-1">Country of Origin</p>
                      <p className="text-gray-900 font-medium">{medicine.manufacturerCountry}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-semibold mb-1">Drug Class</p>
                      <p className="text-gray-900 font-medium">{medicine.drugClass}</p>
                    </div>
                  </div>
                </section>

                {/* Dates */}
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-blue-600" />
                    Approval & Dates
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 font-semibold mb-1">Approval Date</p>
                      <p className="text-gray-900 font-medium">{medicine.approvalDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-semibold mb-1">Expiry Period</p>
                      <p className="text-gray-900 font-medium">{medicine.expiryPeriod}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-semibold mb-1">Approval Status</p>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-gray-900 font-medium">{medicine.approvalStatus}</span>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* Images Tab */}
            {activeTab === 'images' && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Images</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Product Image */}
                  <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square flex items-center justify-center">
                    {medicine.images?.productImage ? (
                      <img
                        src={medicine.images.productImage}
                        alt="Product"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <Package className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600 text-sm">No image available</p>
                      </div>
                    )}
                  </div>

                  {/* Packaging Image */}
                  <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square flex items-center justify-center">
                    {medicine.images?.packagingImage ? (
                      <img
                        src={medicine.images.packagingImage}
                        alt="Packaging"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <Package className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600 text-sm">No image available</p>
                      </div>
                    )}
                  </div>

                  {/* Pill Image */}
                  <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square flex items-center justify-center">
                    {medicine.images?.pillImage ? (
                      <img
                        src={medicine.images.pillImage}
                        alt="Pill"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <Pill className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600 text-sm">No image available</p>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-blue-600" />
                  Regulatory Documents
                </h2>
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-6 h-6 text-blue-600" />
                        <div>
                          <p className="font-semibold text-gray-900">Storage Conditions</p>
                          <p className="text-sm text-gray-600">{medicine.storageConditions}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-6 h-6 text-blue-600" />
                        <div>
                          <p className="font-semibold text-gray-900">Regulatory Notes</p>
                          <p className="text-sm text-gray-600">{medicine.regulatoryNotes}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Batches Tab */}
            {activeTab === 'batches' && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Batches</h2>
                {medicineBatches.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-gray-100 border-b">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                            Batch Number
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                            Quantity
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                            Location
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                            Expiry Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {medicineBatches.map((batch: any) => (
                          <tr key={batch.batchNumber} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900">
                              {batch.batchNumber}
                            </td>
                            <td className="px-6 py-4 text-gray-700">{batch.quantity}</td>
                            <td className="px-6 py-4 text-gray-700">{batch.storageLocation}</td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  batch.status === 'Active'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-yellow-100 text-yellow-700'
                                }`}
                              >
                                {batch.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-gray-700">{batch.expiryDate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No batches found for this medicine</p>
                )}
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
