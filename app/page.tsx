'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [medicineCount, setMedicineCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await fetch('/data/medicines.json');
        const data = await response.json();
        setMedicineCount(data.medicines?.length || 0);
      } catch (error) {
        console.error('Failed to load medicine count:', error);
      }
    };
    fetchCount();
  }, []);

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">ZMRA System</h1>
          <p className="text-xl mb-8">Medicine Recommendation & Inventory Assistant</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/medicines" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">
              Browse Medicines
            </Link>
            <Link href="/search" className="bg-blue-500 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold">
              Search
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto py-20 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-bold text-blue-600 mb-3">📊 Inventory Management</h3>
            <p className="text-gray-700">Track medicines, batches, manufacturing dates, and expiry information.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-bold text-blue-600 mb-3">🔍 Advanced Search</h3>
            <p className="text-gray-700">Search by brand name, generic name, category, or therapeutic use.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-bold text-blue-600 mb-3">💊 Comprehensive Database</h3>
            <p className="text-gray-700">{medicineCount}+ medicines with detailed information.</p>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-8">Quick Stats</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="text-4xl font-bold text-blue-600">{medicineCount}</div>
              <p className="text-gray-600">Medicines in Database</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600">100%</div>
              <p className="text-gray-600">Coverage</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
