'use client';

import { useState, useEffect } from 'react';

interface Medicine {
  name: string;
  category: string;
  price: number;
  description: string;
}

export default function Home() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await fetch('/data/medicines.json');
        const data = await response.json();
        setMedicines(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load medicines:', error);
        setLoading(false);
      }
    };

    fetchMedicines();
  }, []);

  const filteredMedicines = Array.isArray(medicines) 
    ? medicines.filter(med =>
        med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">ZMRA Medicine Search</h1>
        
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search medicines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        {loading ? (
          <p>Loading medicines...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMedicines.map((medicine, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow">
                <h2 className="font-bold text-lg">{medicine.name}</h2>
                <p className="text-gray-600">{medicine.category}</p>
                <p className="text-blue-600 font-bold">${medicine.price}</p>
                <p className="text-gray-700 mt-2">{medicine.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
