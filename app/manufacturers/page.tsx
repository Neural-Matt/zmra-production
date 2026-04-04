"use client";

import { useState, useMemo } from "react";
import { manufacturers } from "@/lib/data";
import { formatDate } from "@/lib/dateUtils";
import { Search, MapPin, Phone, Globe, Award } from "lucide-react";

export default function ManufacturersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredManufacturers = useMemo(() => {
    return manufacturers.filter(
      (mfr) =>
        (filterStatus === "all" || mfr.status === filterStatus) &&
        (mfr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mfr.country.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, filterStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="canvas-bg min-h-screen flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">Manufacturers & Importers</h1>
          <p className="text-sm text-gray-600 mt-1">Licensed pharmaceutical manufacturers and importers</p>
        </div>

        {/* Controls */}
        <div className="surface-panel mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search manufacturers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Showing {filteredManufacturers.length} of {manufacturers.length} manufacturers
          </p>
        </div>

        {/* Grid View */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredManufacturers.map((mfr) => (
            <div key={mfr.id} className="card-elevated">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{mfr.name}</h3>
                  <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                    <MapPin size={16} />
                    {mfr.country}
                  </div>
                </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(mfr.status)}`}>
                {mfr.status.charAt(0).toUpperCase() + mfr.status.slice(1)}
              </span>
            </div>

            <div className="space-y-2 text-sm mb-4">
              <p className="text-gray-600">
                <span className="font-semibold">License #:</span> {mfr.licenseNumber}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Expires:</span> {formatDate(mfr.licenseExpiryDate)}
              </p>
            </div>

            {/* Certifications */}
            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                <Award size={14} /> Certifications
              </p>
              <div className="flex flex-wrap gap-2">
                {mfr.certifications.map((cert, idx) => (
                  <span key={idx} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                    {cert}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Phone size={16} />
                <a href={`tel:${mfr.phone}`} className="text-blue-600 hover:underline">
                  {mfr.phone}
                </a>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Globe size={16} />
                <a href={`https://${mfr.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {mfr.website}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredManufacturers.length === 0 && (
        <div className="surface-panel">
          <p className="text-center text-gray-500">No manufacturers found</p>
        </div>
      )}
      </div>
    </div>
  );
}
