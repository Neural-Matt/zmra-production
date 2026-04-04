'use client';

import React from 'react';
import Link from 'next/link';
import { inspections } from '@/lib/data';
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Calendar,
  MapPin,
  User,
  FileText,
  ImageIcon,
  Check,
  X,
} from 'lucide-react';

export default function InspectionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const inspection = inspections.find((i) => i.id === id);

  if (!inspection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/inspections">
            <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
              <ArrowLeft className="w-5 h-5" />
              Back to Inspections
            </button>
          </Link>
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Inspection Not Found</h1>
            <p className="text-gray-600">The inspection you're looking for could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  const getComplianceColor = (status: string) => {
    if (status === 'compliant') return 'bg-green-100 text-green-700 border-green-200';
    if (status === 'warning') return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-red-100 text-red-700 border-red-200';
  };

  const getComplianceIcon = (status: string) => {
    if (status === 'compliant') return <CheckCircle className="w-6 h-6" />;
    if (status === 'warning') return <AlertCircle className="w-6 h-6" />;
    return <AlertTriangle className="w-6 h-6" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Link href="/inspections">
          <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium">
            <ArrowLeft className="w-5 h-5" />
            Back to Inspections
          </button>
        </Link>

        {/* Header Section */}
        <div className={`rounded-lg shadow-md p-8 mb-6 border-l-4 ${
          inspection.complianceStatus === 'critical'
            ? 'bg-red-50 border-red-500'
            : inspection.complianceStatus === 'warning'
              ? 'bg-yellow-50 border-yellow-500'
              : 'bg-green-50 border-green-500'
        }`}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {inspection.facilityName}
              </h1>
              <p className="text-gray-600 text-lg">{inspection.inspectionNumber}</p>
            </div>
            <div className={`rounded-lg p-4 ${getComplianceColor(inspection.complianceStatus)} flex flex-col items-center gap-2 border`}>
              {getComplianceIcon(inspection.complianceStatus)}
              <span className="font-bold capitalize text-sm">
                {inspection.complianceStatus}
              </span>
            </div>
          </div>

          {/* Compliance Score Banner */}
          <div className="bg-white rounded-lg p-4 inline-block">
            <p className="text-sm text-gray-600 mb-1">Compliance Score</p>
            <p className="text-4xl font-bold text-gray-900">{inspection.complianceScore}%</p>
          </div>
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <p className="text-sm text-gray-600 font-semibold">Facility Type</p>
            </div>
            <p className="text-lg font-bold text-gray-900 capitalize">
              {inspection.facilityType}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <p className="text-sm text-gray-600 font-semibold">Location</p>
            </div>
            <p className="text-lg font-bold text-gray-900">{inspection.location}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-2">
              <User className="w-5 h-5 text-blue-600" />
              <p className="text-sm text-gray-600 font-semibold">Inspector</p>
            </div>
            <p className="text-lg font-bold text-gray-900">{inspection.inspectorName}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <p className="text-sm text-gray-600 font-semibold">Inspection Date</p>
            </div>
            <p className="text-lg font-bold text-gray-900">{inspection.inspectionDate}</p>
          </div>
        </div>

        {/* Inspection Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left Column - Details */}
          <div className="lg:col-span-2">
            {/* Inspection Information */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-600" />
                Inspection Information
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-1">Inspection Type</p>
                  <p className="text-gray-900 capitalize">{inspection.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-1">Status</p>
                  <p className="text-gray-900 capitalize">{inspection.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-1">Completion Date</p>
                  <p className="text-gray-900">{inspection.completionDate || 'Pending'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-1">Severity</p>
                  <p className="text-gray-900 capitalize">{inspection.findingsSeverity}</p>
                </div>
              </div>
            </div>

            {/* Inspector Comments */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Inspector Comments</h2>
              <p className="text-gray-700 leading-relaxed mb-4">{inspection.inspectorComments}</p>
            </div>

            {/* Findings */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Findings</h2>
              <p className="text-gray-700 leading-relaxed mb-6">{inspection.findings}</p>

              {/* Violations List */}
              {inspection.violations.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Identified Violations</h3>
                  <ul className="space-y-2">
                    {inspection.violations.map((violation, index) => (
                      <li key={index} className="flex items-start gap-3 bg-red-50 p-3 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-900">{violation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recommendations</h2>
              <p className="text-gray-700 leading-relaxed bg-blue-50 p-4 rounded-lg">
                {inspection.recommendations}
              </p>
            </div>

            {/* Inspection Checklist */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Inspection Checklist</h2>
              <div className="space-y-6">
                {inspection.inspectionChecklist.map((category, catIdx) => (
                  <div key={catIdx}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b-2 border-gray-200">
                      {category.category}
                    </h3>
                    <div className="space-y-2">
                      {category.items.map((item, itemIdx) => (
                        <div
                          key={itemIdx}
                          className={`flex items-start gap-3 p-3 rounded-lg ${
                            item.status === 'passed'
                              ? 'bg-green-50'
                              : item.status === 'failed'
                                ? 'bg-red-50'
                                : 'bg-gray-50'
                          }`}
                        >
                          {item.status === 'passed' ? (
                            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          ) : item.status === 'failed' ? (
                            <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{item.item}</p>
                            {item.comments && (
                              <p className="text-sm text-gray-600 mt-1">{item.comments}</p>
                            )}
                          </div>
                          <span
                            className={`px-3 py-1 rounded text-xs font-semibold ${
                              item.status === 'passed'
                                ? 'bg-green-200 text-green-700'
                                : item.status === 'failed'
                                  ? 'bg-red-200 text-red-700'
                                  : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            {item.status === 'passed'
                              ? 'Passed'
                              : item.status === 'failed'
                                ? 'Failed'
                                : 'N/A'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Photos & Risk */}
          <div>
            {/* Risk Score */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment</h3>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-600 font-semibold">Risk Score</p>
                  <p className="text-3xl font-bold text-gray-900">{inspection.riskScore}/10</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      inspection.riskScore >= 7
                        ? 'bg-red-600'
                        : inspection.riskScore >= 4
                          ? 'bg-yellow-600'
                          : 'bg-green-600'
                    }`}
                    style={{ width: `${inspection.riskScore * 10}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Inspection Photos */}
            {inspection.photos.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-blue-600" />
                  Inspection Photos
                </h3>
                <div className="space-y-3">
                  {inspection.photos.map((photo, idx) => (
                    <div key={idx} className="bg-gray-100 rounded-lg p-4 text-center">
                      <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">{photo}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Facility Summary */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Facility Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-xs text-gray-600 font-semibold mb-1">Facility Name</p>
              <p className="font-semibold text-gray-900">{inspection.facilityName}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-xs text-gray-600 font-semibold mb-1">Facility Type</p>
              <p className="font-semibold text-gray-900 capitalize">{inspection.facilityType}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-xs text-gray-600 font-semibold mb-1">Location</p>
              <p className="font-semibold text-gray-900">{inspection.location}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-xs text-gray-600 font-semibold mb-1">Compliance Status</p>
              <p className={`font-semibold capitalize ${
                inspection.complianceStatus === 'compliant'
                  ? 'text-green-600'
                  : inspection.complianceStatus === 'warning'
                    ? 'text-yellow-600'
                    : 'text-red-600'
              }`}>
                {inspection.complianceStatus}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
