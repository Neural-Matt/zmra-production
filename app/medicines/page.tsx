'use client';

import { useState, useEffect } from 'react';

interface Medicine {
  id: string;
  brandName: string;
  genericName: string;
  therapeuticCategory: string;
  drugClass: string;
  dosageForm: string;
  strength: string;
  routeOfAdministration: string;
  manufacturer: string;
  manufacturerCountry: string;
  approvalStatus: string;
  images?: {
    productImage: string;
    pillImage: string;
    packagingImage: string;
  };
  batches: Array<{
    batchNumber: string;
    manufacturingDate: string;
    expiryDate: string;
    quantity: number;
  }>;
}

export default function MedicinesPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await fetch('/data/medicines.json');
        const data = await response.json();
        setMedicines(data.medicines || []);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load medicines:', error);
        setLoading(false);
      }
    };
    fetchMedicines();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-2">Available Medicines</h1>
        <p className="text-gray-600 mb-8">Browse our comprehensive database of {medicines.length} medicines</p>

        {loading ? (
          <div className="text-center py-12">Loading medicines...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {medicines.map((medicine) => (
              <div
                key={medicine.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer p-6"
                onClick={() => setSelectedMedicine(medicine)}
              >
                {medicine.images?.productImage && (
                  <img
                    src={medicine.images.productImage}
                    alt={medicine.brandName}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <h3 className="text-xl font-bold text-blue-600 mb-2">{medicine.brandName}</h3>
                <p className="text-gray-600 mb-2">{medicine.genericName}</p>
                <p className="text-sm text-gray-500 mb-1"><strong>Category:</strong> {medicine.therapeuticCategory}</p>
                <p className="text-sm text-gray-500 mb-1"><strong>Form:</strong> {medicine.dosageForm}</p>
                <p className="text-sm text-gray-500"><strong>Strength:</strong> {medicine.strength}</p>
              </div>
            ))}
          </div>
        )}

        {/* Modal for medicine details */}
        {selectedMedicine && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedMedicine(null)}>
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-3xl font-bold text-blue-600 mb-4">{selectedMedicine.brandName}</h2>
              
              {selectedMedicine.images?.productImage && (
                <img
                  src={selectedMedicine.images.productImage}
                  alt={selectedMedicine.brandName}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
              )}

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h4 className="font-bold text-gray-600">Generic Name</h4>
                  <p>{selectedMedicine.genericName}</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-600">Category</h4>
                  <p>{selectedMedicine.therapeuticCategory}</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-600">Drug Class</h4>
                  <p>{selectedMedicine.drugClass}</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-600">Route</h4>
                  <p>{selectedMedicine.routeOfAdministration}</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-600">Dosage Form</h4>
                  <p>{selectedMedicine.dosageForm}</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-600">Strength</h4>
                  <p>{selectedMedicine.strength}</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-600">Manufacturer</h4>
                  <p>{selectedMedicine.manufacturer} ({selectedMedicine.manufacturerCountry})</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-600">Approval Status</h4>
                  <p className="text-green-600 font-semibold">{selectedMedicine.approvalStatus}</p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-bold text-gray-600 mb-3">Batch Information</h4>
                <div className="space-y-3">
                  {selectedMedicine.batches.map((batch, idx) => (
                    <div key={idx} className="bg-gray-50 p-3 rounded">
                      <p><strong>Batch:</strong> {batch.batchNumber}</p>
                      <p><strong>Manufactured:</strong> {batch.manufacturingDate}</p>
                      <p><strong>Expires:</strong> {batch.expiryDate}</p>
                      <p><strong>Available:</strong> {batch.quantity} units</p>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setSelectedMedicine(null)}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
