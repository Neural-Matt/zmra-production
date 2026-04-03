'use client';

import { useState, useEffect } from 'react';

export default function ManufacturersPage() {
  const [manufacturers, setManufacturers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', country: '', status: '' });

  useEffect(() => {
    setManufacturers([
      { id: 1, name: 'PharmaCorp Industries', country: 'USA', products: 15, status: 'Active', certification: 'ISO 9001', established: '2010' },
      { id: 2, name: 'GlobalMed Solutions', country: 'Germany', products: 22, status: 'Active', certification: 'GMP', established: '2005' },
      { id: 3, name: 'Asia Pharma Group', country: 'India', products: 18, status: 'Active', certification: 'ISO 9001', established: '2012' },
      { id: 4, name: 'EuroDrug Manufacturing', country: 'Switzerland', products: 10, status: 'Active', certification: 'GMP', established: '2015' },
      { id: 5, name: 'Orient Healthcare', country: 'China', products: 25, status: 'Inactive', certification: 'ISO 9001', established: '2008' },
    ]);
  }, []);

  const handleAddManufacturer = () => {
    if (formData.name && formData.country) {
      setManufacturers([...manufacturers, {
        id: manufacturers.length + 1,
        name: formData.name,
        country: formData.country,
        products: 0,
        status: formData.status || 'Active',
        certification: 'Pending',
        established: new Date().getFullYear().toString()
      }]);
      setFormData({ name: '', country: '', status: '' });
      setShowForm(false);
    }
  };

  const getStatusBadge = (status) => {
    return status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Manufacturers & Suppliers</h1>
          <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            {showForm ? 'Cancel' : '+ Add Manufacturer'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="grid md:grid-cols-3 gap-4">
              <input type="text" placeholder="Manufacturer Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="border p-2 rounded" />
              <input type="text" placeholder="Country" value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})} className="border p-2 rounded" />
              <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="border p-2 rounded">
                <option value="">Select Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <button onClick={handleAddManufacturer} className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">Add</button>
          </div>
        )}

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600">Total Manufacturers</p>
            <p className="text-3xl font-bold">{manufacturers.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600">Active</p>
            <p className="text-3xl font-bold text-green-600">{manufacturers.filter(m => m.status === 'Active').length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600">Total Products</p>
            <p className="text-3xl font-bold">{manufacturers.reduce((sum, m) => sum + m.products, 0)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600">Countries</p>
            <p className="text-3xl font-bold">{new Set(manufacturers.map(m => m.country)).size}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Name</th>
                <th className="px-6 py-3 text-left font-semibold">Country</th>
                <th className="px-6 py-3 text-left font-semibold">Products</th>
                <th className="px-6 py-3 text-left font-semibold">Certification</th>
                <th className="px-6 py-3 text-left font-semibold">Status</th>
                <th className="px-6 py-3 text-left font-semibold">Established</th>
              </tr>
            </thead>
            <tbody>
              {manufacturers.map((mfg) => (
                <tr key={mfg.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-3 font-semibold">{mfg.name}</td>
                  <td className="px-6 py-3">{mfg.country}</td>
                  <td className="px-6 py-3">{mfg.products}</td>
                  <td className="px-6 py-3"><span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs">{mfg.certification}</span></td>
                  <td className="px-6 py-3"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(mfg.status)}`}>{mfg.status}</span></td>
                  <td className="px-6 py-3">{mfg.established}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
