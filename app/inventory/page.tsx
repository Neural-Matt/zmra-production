'use client';

import { useState, useEffect } from 'react';

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ medicineName: '', quantity: '', batchNumber: '', expiryDate: '' });

  useEffect(() => {
    setInventory([
      { id: 1, medicine: 'Paracetamol', quantity: 500, batch: 'BATCH-001', expiry: '2027-06-15', status: 'Good' },
      { id: 2, medicine: 'Ibuprofen', quantity: 120, batch: 'BATCH-002', expiry: '2027-03-20', status: 'Low' },
      { id: 3, medicine: 'Aspirin', quantity: 800, batch: 'BATCH-003', expiry: '2026-12-10', status: 'Expiring Soon' },
    ]);
  }, []);

  const handleAdd = () => {
    if (formData.medicineName && formData.quantity) {
      setInventory([...inventory, {
        id: inventory.length + 1,
        medicine: formData.medicineName,
        quantity: parseInt(formData.quantity),
        batch: formData.batchNumber,
        expiry: formData.expiryDate,
        status: 'Good'
      }]);
      setFormData({ medicineName: '', quantity: '', batchNumber: '', expiryDate: '' });
      setShowForm(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Good': return 'bg-green-100 text-green-800';
      case 'Low': return 'bg-yellow-100 text-yellow-800';
      case 'Expiring Soon': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Inventory Management</h1>
          <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            {showForm ? 'Cancel' : '+ Add Medicine'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="grid md:grid-cols-2 gap-4">
              <input type="text" placeholder="Medicine Name" value={formData.medicineName} onChange={(e) => setFormData({...formData, medicineName: e.target.value})} className="border p-2 rounded" />
              <input type="number" placeholder="Quantity" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} className="border p-2 rounded" />
              <input type="text" placeholder="Batch Number" value={formData.batchNumber} onChange={(e) => setFormData({...formData, batchNumber: e.target.value})} className="border p-2 rounded" />
              <input type="date" value={formData.expiryDate} onChange={(e) => setFormData({...formData, expiryDate: e.target.value})} className="border p-2 rounded" />
            </div>
            <button onClick={handleAdd} className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">Save</button>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Medicine</th>
                <th className="px-6 py-3 text-left font-semibold">Quantity</th>
                <th className="px-6 py-3 text-left font-semibold">Batch Number</th>
                <th className="px-6 py-3 text-left font-semibold">Expiry Date</th>
                <th className="px-6 py-3 text-left font-semibold">Status</th>
                <th className="px-6 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-3">{item.medicine}</td>
                  <td className="px-6 py-3">{item.quantity} units</td>
                  <td className="px-6 py-3">{item.batch}</td>
                  <td className="px-6 py-3">{item.expiry}</td>
                  <td className="px-6 py-3"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.status)}`}>{item.status}</span></td>
                  <td className="px-6 py-3 space-x-2"><button className="text-blue-600 hover:underline">Edit</button><button className="text-red-600 hover:underline">Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
