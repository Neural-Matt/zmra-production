'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { batches, medicines } from '@/lib/data';
import { ArrowLeft, AlertTriangle, CheckCircle, Calendar, Pill } from 'lucide-react';

interface BatchDetailProps {
  params: Promise<{
    id: string;
  }>;
}

// Helper to calculate days until expiry
const calculateDaysUntilExpiry = (expiryDate: string): number => {
  const today = new Date('2026-03-14');
  const expiry = new Date(expiryDate);
  const timeDiff = expiry.getTime() - today.getTime();
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
};

export default function BatchDetailPage({ params }: BatchDetailProps) {
  const { id } = use(params);
  const batch = batches.find((b) => b.id === id);
  const medicine = batch ? medicines.find((m) => m.id === batch.medicineId) : null;
  const [activeTab, setActiveTab] = useState('overview');

  if (!batch || !medicine) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-6xl mx-auto">
          <Link href="/inventory" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Inventory
          </Link>
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Batch Not Found</h2>
            <p className="text-gray-600">The batch you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  const daysLeft = calculateDaysUntilExpiry(batch.expiryDate);
  const isExpired = daysLeft <= 0;
  const isSoonToExpire = daysLeft > 0 && daysLeft <= 90;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link href="/inventory" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 font-medium">
          <ArrowLeft className="w-4 h-4" />
          Back to Inventory
        </Link>

        {/* Batch Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{batch.batchNumber}</h1>
              <p className="text-gray-600 text-lg">{batch.medicineName}</p>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
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
          </div>

          {/* Alert for soon-to-expire or expired batches */}
          {isExpired && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-900">Batch Expired</h3>
                <p className="text-red-700 text-sm">
                  This batch expired on {batch.expiryDate}. It should not be used.
                </p>
              </div>
            </div>
          )}

          {isSoonToExpire && !isExpired && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
              <Calendar className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-yellow-900">Expires Soon</h3>
                <p className="text-yellow-700 text-sm">
                  This batch will expire in {daysLeft} days ({batch.expiryDate}). Plan for replacement.
                </p>
              </div>
            </div>
          )}

          {!isExpired && !isSoonToExpire && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-green-900">Valid Stock</h3>
                <p className="text-green-700 text-sm">
                  Batch expires on {batch.expiryDate} ({daysLeft} days remaining).
                </p>
              </div>
            </div>
          )}

          {/* Key Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-xs text-gray-600 font-semibold mb-1">Manufacturer</p>
              <p className="text-lg font-bold text-gray-900">{batch.manufacturerName}</p>
            </div>
            <div className="p-4 bg-indigo-50 rounded-lg">
              <p className="text-xs text-gray-600 font-semibold mb-1">Quantity</p>
              <p className="text-lg font-bold text-gray-900">
                {batch.quantity} {batch.unit}
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-xs text-gray-600 font-semibold mb-1">Storage Location</p>
              <p className="text-lg font-bold text-gray-900">{batch.location}</p>
            </div>
            <div className="p-4 bg-pink-50 rounded-lg">
              <p className="text-xs text-gray-600 font-semibold mb-1">Quality Status</p>
              <p className="text-lg font-bold text-gray-900">
                {batch.qualityStatus.charAt(0).toUpperCase() + batch.qualityStatus.slice(1)}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex">
              {['overview', 'medicine-info', 'storage'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                    activeTab === tab
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab === 'overview'
                    ? 'Batch Overview'
                    : tab === 'medicine-info'
                      ? 'Medicine Info'
                      : 'Storage Details'}
                </button>
              ))}
            </div>
          </div>

          <div className="p-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Batch Information */}
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Pill className="w-6 h-6 text-blue-600" />
                    Batch Information
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 font-semibold mb-1">Batch Number</p>
                      <p className="text-gray-900 font-medium">{batch.batchNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-semibold mb-1">Medicine Name</p>
                      <p className="text-gray-900 font-medium">{batch.medicineName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-semibold mb-1">Manufacturer</p>
                      <p className="text-gray-900 font-medium">{batch.manufacturerName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-semibold mb-1">Batch Status</p>
                      <p className="text-gray-900 font-medium">
                        {batch.status.charAt(0).toUpperCase() + batch.status.slice(1)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-semibold mb-1">Quality Status</p>
                      <p className="text-gray-900 font-medium">
                        {batch.qualityStatus === 'compliant' ? (
                          <span className="text-green-600">✓ Compliant</span>
                        ) : batch.qualityStatus === 'expired' ? (
                          <span className="text-red-600">✗ Expired</span>
                        ) : batch.qualityStatus === 'failed' ? (
                          <span className="text-red-600">✗ Failed Testing</span>
                        ) : (
                          <span className="text-gray-900">
                            {batch.qualityStatus.charAt(0).toUpperCase() +
                              batch.qualityStatus.slice(1)}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </section>

                {/* Dates */}
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-blue-600" />
                    Important Dates
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 font-semibold mb-1">Manufacturing Date</p>
                      <p className="text-gray-900 font-medium">{batch.manufacturingDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-semibold mb-1">Expiry Date</p>
                      <p className="text-gray-900 font-medium">{batch.expiryDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-semibold mb-1">Days Until Expiry</p>
                      <p
                        className={`text-gray-900 font-medium ${
                          isExpired
                            ? 'text-red-600'
                            : isSoonToExpire
                              ? 'text-yellow-600'
                              : 'text-green-600'
                        }`}
                      >
                        {isExpired ? `${Math.abs(daysLeft)} days ago (EXPIRED)` : `${daysLeft} days`}
                      </p>
                    </div>
                  </div>
                </section>

                {/* Quantity & Storage */}
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Inventory Details</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 font-semibold mb-1">Quantity</p>
                      <p className="text-gray-900 font-medium">
                        {batch.quantity} {batch.unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-semibold mb-1">Unit Type</p>
                      <p className="text-gray-900 font-medium">
                        {batch.unit.charAt(0).toUpperCase() + batch.unit.slice(1)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-semibold mb-1">Storage Location</p>
                      <p className="text-gray-900 font-medium">{batch.location}</p>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* Medicine Info Tab */}
            {activeTab === 'medicine-info' && (
              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Medicine Details</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 font-semibold mb-1">Brand Name</p>
                      <p className="text-gray-900 font-medium">{medicine.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-semibold mb-1">Generic Name</p>
                      <p className="text-gray-900 font-medium">
                        {medicine.genericName || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-semibold mb-1">Dosage Form</p>
                      <p className="text-gray-900 font-medium">{medicine.dosageForm}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-semibold mb-1">Strength</p>
                      <p className="text-gray-900 font-medium">{medicine.strength}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-semibold mb-1">Therapeutic Class</p>
                      <p className="text-gray-900 font-medium">
                        {medicine.therapeuticCategory}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-semibold mb-1">Active Ingredient</p>
                      <p className="text-gray-900 font-medium">{medicine.activeIngredient}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-semibold mb-1">Registration Number</p>
                      <p className="text-gray-900 font-medium">{medicine.registrationNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-semibold mb-1">Registration Status</p>
                      <p className="text-gray-900 font-medium">
                        {medicine.status.charAt(0).toUpperCase() + medicine.status.slice(1)}
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* Storage Details Tab */}
            {activeTab === 'storage' && (
              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Storage & Conditions</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 font-semibold mb-2">Storage Location</p>
                      <p className="text-lg font-medium text-gray-900 mb-4">{batch.location}</p>
                      <p className="text-sm text-gray-600">
                        {batch.location.includes('Cold') ? (
                          <>
                            <span className="font-semibold">Temperature:</span> 2-8°C (Refrigerated)
                          </>
                        ) : (
                          <>
                            <span className="font-semibold">Temperature:</span> Room temperature
                            (15-25°C)
                          </>
                        )}
                      </p>
                    </div>

                    <div className="p-6 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 font-semibold mb-2">Batch Status</p>
                      <p className="text-lg font-medium text-gray-900 mb-4">
                        {batch.status === 'available'
                          ? 'Available for Distribution'
                          : batch.status === 'reserved'
                            ? 'Reserved - Not Available'
                            : batch.status === 'quarantined'
                              ? 'Quarantined - Under Review'
                              : 'Distributed'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {batch.status === 'quarantined' ? (
                          <>
                            <span className="font-semibold text-orange-600">⚠️ This batch is under
                            quarantine and cannot be distributed.</span>
                          </>
                        ) : batch.status === 'available' ? (
                          <>
                            <span className="font-semibold text-green-600">✓ Ready for distribution</span>
                          </>
                        ) : (
                          <>Ready for further operations</>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-600 font-semibold mb-2">Quality Assessment</p>
                    <p className="text-gray-700">
                      {batch.qualityStatus === 'compliant' && (
                        <>
                          ✓ This batch has passed all quality tests and is compliant with regulatory
                          standards.
                        </>
                      )}
                      {batch.qualityStatus === 'failed' && (
                        <>
                          ✗ This batch has failed quality testing and is under quarantine. Do not
                          distribute.
                        </>
                      )}
                      {batch.qualityStatus === 'expired' && (
                        <>
                          ✗ This batch has expired and must not be used or distributed. Schedule for
                          disposal.
                        </>
                      )}
                    </p>
                  </div>
                </section>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
