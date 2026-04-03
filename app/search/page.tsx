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
  manufacturer: string;
}

export default function SearchPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [results, setResults] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = medicines.filter(med => {
      switch (searchType) {
        case 'brand':
          return med.brandName.toLowerCase().includes(term);
        case 'generic':
          return med.genericName.toLowerCase().includes(term);
        case 'category':
          return med.therapeuticCategory.toLowerCase().includes(term);
        case 'manufacturer':
          return med.manufacturer.toLowerCase().includes(term);
        default:
          return (
            med.brandName.toLowerCase().includes(term) ||
            med.genericName.toLowerCase().includes(term) ||
            med.therapeuticCategory.toLowerCase().includes(term) ||
            med.manufacturer.toLowerCase().includes(term)
          );
      }
    });

    setResults(filtered);
  }, [searchTerm, searchType, medicines]);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Search Medicines</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-2">Search Type</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {['all', 'brand', 'generic', 'category', 'manufacturer'].map(type => (
                <button
                  key={type}
                  onClick={() => setSearchType(type)}
                  className={`py-2 px-4 rounded-lg font-semibold transition ${
                    searchType === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <input
            type="text"
            placeholder={`Search by ${searchType === 'all' ? 'any field' : searchType}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {loading ? (
          <div className="text-center py-12">Loading medicines...</div>
        ) : (
          <>
            {searchTerm && (
              <p className="text-gray-600 mb-6">
                Found <span className="font-bold text-blue-600">{results.length}</span> medicine(s)
              </p>
            )}

            {results.length > 0 ? (
              <div className="space-y-4">
                {results.map((medicine) => (
                  <div key={medicine.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-2xl font-bold text-blue-600 mb-2">{medicine.brandName}</h3>
                        <p className="text-gray-600 mb-1"><strong>Generic:</strong> {medicine.genericName}</p>
                        <p className="text-gray-600 mb-1"><strong>Form:</strong> {medicine.dosageForm}</p>
                        <p className="text-gray-600"><strong>Strength:</strong> {medicine.strength}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1"><strong>Category:</strong> {medicine.therapeuticCategory}</p>
                        <p className="text-gray-600 mb-1"><strong>Class:</strong> {medicine.drugClass}</p>
                        <p className="text-gray-600"><strong>Manufacturer:</strong> {medicine.manufacturer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : searchTerm ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                <p className="text-gray-700">No medicines found matching your search.</p>
                <p className="text-gray-600 text-sm mt-2">Try different keywords or search criteria.</p>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                <p className="text-gray-700">Enter a search term to find medicines.</p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
