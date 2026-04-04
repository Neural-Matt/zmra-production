"use client";

import { useState } from "react";
import { Search, Pill, ShieldAlert, CheckCircle, AlertCircle, QrCode } from "lucide-react";
import { medicines, safetyAlerts, batches } from "@/lib/data";

export default function VerifyPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<"name" | "barcode" | "batch">("name");
  const [searchResults, setSearchResults] = useState<typeof medicines>([]);
  const [selectedMedicine, setSelectedMedicine] = useState<typeof medicines[0] | null>(null);
  const [showQRScanner, setShowQRScanner] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    let results: typeof medicines = [];

    if (searchType === "name") {
      results = medicines.filter((m) =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else if (searchType === "batch") {
      const matchingBatches = batches.filter((b) =>
        b.batchNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const medicineIds = matchingBatches.map((b) => b.medicineId);
      results = medicines.filter((m) => medicineIds.includes(m.id));
    } else if (searchType === "barcode") {
      // Simulate barcode lookup
      results = medicines.filter((m) => m.id === searchTerm || m.registrationNumber === searchTerm);
    }

    setSearchResults(results);
  };

  const getMedicineAlerts = (medicineId: string) => {
    return safetyAlerts.filter((alert) => alert.medicineId === medicineId);
  };

  const getMedicineStatus = (medicine: typeof medicines[0]) => {
    const alerts = getMedicineAlerts(medicine.id);
    if (alerts.some((a) => a.status === "active" && a.recallLevel === "Class I")) {
      return { status: "recall", color: "text-red-600", bg: "bg-red-50", label: "Recall Active" };
    } else if (alerts.some((a) => a.status === "recalled")) {
      return { status: "recalled", color: "text-red-600", bg: "bg-red-50", label: "Recalled" };
    } else if (medicine.status === "approved") {
      return { status: "approved", color: "text-green-600", bg: "bg-green-50", label: "Approved" };
    } else {
      return { status: medicine.status, color: "text-yellow-600", bg: "bg-yellow-50", label: medicine.status.toUpperCase() };
    }
  };

  return (
    <div className="p-6 lg:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <ShieldAlert size={32} className="text-blue-600" />
          Public Medicine Verification
        </h1>
        <p className="text-gray-600 mt-2">
          Verify medicine authenticity, batch validity, and safety status
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Search Panel */}
        <div className="lg:col-span-2">
          {/* Search Form */}
          <div className="bg-white rounded-lg shadow p-8 mb-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Search for Medicine</h2>

            <form onSubmit={handleSearch} className="space-y-6">
              {/* Search Type Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Search By
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "name", label: "Medicine Name", icon: Pill },
                    { value: "batch", label: "Batch Number", icon: Search },
                    { value: "barcode", label: "Barcode/Registration", icon: QrCode },
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setSearchType(value as any)}
                      className={`py-3 px-4 rounded-lg border-2 transition-all ${
                        searchType === value
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <Icon size={20} className="mx-auto mb-1" />
                      <p className="text-xs font-semibold">{label}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Enter {searchType === "name" ? "Medicine Name" : searchType === "batch" ? "Batch Number" : "Barcode or Registration Number"}
                </label>
                <div className="relative">
                  <Search
                    size={20}
                    className="absolute left-4 top-4 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder={`e.g., ${searchType === "name" ? "Paracetamol" : searchType === "batch" ? "PAB-2026-001" : "ZMB-2019-0001"}`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 text-lg"
                  />
                </div>
              </div>

              {/* Button Group */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Search size={20} />
                  Search Medicine
                </button>
                <button
                  type="button"
                  onClick={() => setShowQRScanner(!showQRScanner)}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <QrCode size={20} />
                  QR Code
                </button>
              </div>
            </form>

            {/* QR Scanner Simulation */}
            {showQRScanner && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">QR Code Scanner</h3>
                <div className="bg-gray-100 rounded-lg aspect-square flex items-center justify-center border-2 border-dashed border-gray-300 mb-4">
                  <div className="text-center">
                    <QrCode size={48} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-600 text-sm">Point camera at QR code to scan</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Simulation: Scan a QR code on medicine packaging to automatically retrieve verification details
                </p>
              </div>
            )}
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Found {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}
              </h2>
              {searchResults.map((medicine) => {
                const statusInfo = getMedicineStatus(medicine);
                const alerts = getMedicineAlerts(medicine.id);
                return (
                  <div
                    key={medicine.id}
                    onClick={() => setSelectedMedicine(medicine)}
                    className="bg-white rounded-lg shadow p-6 border border-gray-100 hover:shadow-lg cursor-pointer transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {medicine.name}
                        </h3>
                        <p className="text-gray-600">{medicine.genericName}</p>
                      </div>
                      <div className={`px-4 py-2 rounded-lg font-semibold ${statusInfo.color} ${statusInfo.bg}`}>
                        {statusInfo.label}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Strength</p>
                        <p className="text-gray-900 font-medium">{medicine.strength}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Dosage Form</p>
                        <p className="text-gray-900 font-medium">{medicine.dosageForm}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Manufacturer</p>
                        <p className="text-gray-900 font-medium text-sm">{medicine.manufacturer}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Registration #</p>
                        <p className="text-gray-900 font-medium text-sm">{medicine.registrationNumber}</p>
                      </div>
                    </div>

                    {alerts.length > 0 && (
                      <div className={`p-3 rounded-lg mb-4 ${alerts[0].recallLevel === "Class I" ? "bg-red-50 border border-red-200" : "bg-yellow-50 border border-yellow-200"}`}>
                        <div className="flex items-center gap-2">
                          <AlertCircle size={16} className={alerts[0].recallLevel === "Class I" ? "text-red-600" : "text-yellow-600"} />
                          <div>
                            <p className={`font-semibold text-sm ${alerts[0].recallLevel === "Class I" ? "text-red-700" : "text-yellow-700"}`}>
                              {alerts[0].recallLevel} Safety Alert
                            </p>
                            <p className={`text-xs ${alerts[0].recallLevel === "Class I" ? "text-red-600" : "text-yellow-600"}`}>
                              {alerts[0].details}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                      View Full Details →
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {searchTerm && searchResults.length === 0 && (
            <div className="bg-white rounded-lg shadow p-12 border border-gray-100 text-center">
              <AlertCircle size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600 font-medium">No medicines found</p>
              <p className="text-gray-500 text-sm mt-2">
                Try searching with a different term or medicine name
              </p>
            </div>
          )}
        </div>

        {/* Medicine Details Panel */}
        <div>
          {selectedMedicine && (
            <div className="bg-white rounded-lg shadow border border-gray-100 sticky top-24">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-semibold text-gray-900">Medicine Details</h3>
              </div>

              <div className="p-6 space-y-6">
                {/* Status */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Status</p>
                  <div className={`px-4 py-2 rounded-lg font-semibold text-center ${getMedicineStatus(selectedMedicine).color} ${getMedicineStatus(selectedMedicine).bg}`}>
                    {getMedicineStatus(selectedMedicine).label}
                  </div>
                </div>

                {/* Basic Info */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Active Ingredient</p>
                  <p className="text-gray-900 font-medium">{selectedMedicine.activeIngredient}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Therapeutic Category</p>
                  <p className="text-gray-900 font-medium">{selectedMedicine.therapeuticCategory}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Manufacturer</p>
                  <p className="text-gray-900 font-medium">{selectedMedicine.manufacturer}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Country of Origin</p>
                  <p className="text-gray-900 font-medium">{selectedMedicine.country}</p>
                </div>

                {/* Validity */}
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Approval Validity</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Approval Date:</span>
                      <span className="text-gray-900 font-medium">{new Date(selectedMedicine.approvalDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expiry Date:</span>
                      <span className="text-gray-900 font-medium">{new Date(selectedMedicine.expiryDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Safety Alerts */}
                {getMedicineAlerts(selectedMedicine.id).length > 0 && (
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-xs font-semibold text-red-600 uppercase mb-3">Active Safety Alerts</p>
                    {getMedicineAlerts(selectedMedicine.id).map((alert) => (
                      <div key={alert.id} className="bg-red-50 border border-red-200 rounded p-3 mb-2">
                        <p className="font-semibold text-red-700 text-sm">{alert.recallLevel}</p>
                        <p className="text-red-600 text-xs mt-1">{alert.details}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Button */}
                <button className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors mt-4">
                  Report Suspected Counterfeit
                </button>
              </div>
            </div>
          )}

          {!selectedMedicine && (
            <div className="bg-white rounded-lg shadow border border-gray-100 p-12 text-center">
              <Pill size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600 font-medium">Select a medicine to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <CheckCircle size={28} className="text-blue-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Verified Authentic</h3>
          <p className="text-gray-700 text-sm">
            All registered medicines in this system have been verified and approved by ZMRA
          </p>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 border border-yellow-200">
          <AlertCircle size={28} className="text-yellow-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Active Monitoring</h3>
          <p className="text-gray-700 text-sm">
            Medicines are continuously monitored for safety and quality compliance
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <Pill size={28} className="text-green-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Public Resource</h3>
          <p className="text-gray-700 text-sm">
            Free verification service for consumers and healthcare professionals
          </p>
        </div>
      </div>
    </div>
  );
}
