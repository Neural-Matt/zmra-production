'use client';

import { useState, useEffect } from 'react';

export default function InspectionsPage() {
  const [inspections, setInspections] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ facility: '', inspectionType: '', status: '', date: '' });

  useEffect(() => {
    setInspections([
      { id: 1, facility: 'Main Warehouse', type: 'Storage', status: 'Completed', date: '2026-04-01', inspector: 'John Doe', findings: 'No issues' },
      { id: 2, facility: 'Cold Storage', type: 'Temperature Control', status: 'Completed', date: '2026-04-02', inspector: 'Jane Smith', findings: 'Minor maintenance needed' },
      { id: 3, facility: 'Quality Lab', type: 'Cleanliness', status: 'Pending', date: '2026-04-10', inspector: 'Robert Johnson', findings: 'Awaiting inspection' },
      { id: 4, facility: 'Distribution Center', type: 'Safety', status: 'In Progress', date: '2026-04-15', inspector: 'Emily Davis', findings: 'Fire extinguishers checked' },
    ]);
  }, []);

  const handleAddInspection = () => {
    if (formData.facility && formData.inspectionType) {
      setInspections([...inspections, {
        id: inspections.length + 1,
        facility: formData.facility,
        type: formData.inspectionType,
        status: formData.status || 'Pending',
        date: formData.date,
        inspector: 'Inspector Name',
        findings: 'Awaiting inspection'
      }]);
      setFormData({ facility: '', inspectionType: '', status: '', date: '' });
      setShowForm(false);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      'Completed': 'bg-green-100 text-green-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'In Progress': 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Facility Inspections</h1>
          <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            {showForm ? 'Cancel' : '+ Schedule Inspection'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="grid md:grid-cols-3 gap-4">
              <input type="text" placeholder="Facility Name" value={formData.facility} onChange={(e) => setFormData({...formData, facility: e.target.value})} className="border p-2 rounded" />
              <select value={formData.inspectionType} onChange={(e) => setFormData({...formData, inspectionType: e.target.value})} className="border p-2 rounded">
                <option value="">Select Inspection Type</option>
                <option value="Storage">Storage Conditions</option>
                <option value="Temperature Control">Temperature Control</option>
                <option value="Cleanliness">Cleanliness & Sanitation</option>
                <option value="Safety">Safety & Security</option>
              </select>
              <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="border p-2 rounded" />
            </div>
            <button onClick={handleAddInspection} className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">Schedule</button>
          </div>
        )}

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600">Total</p>
            <p className="text-3xl font-bold text-blue-600">{inspections.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600">Completed</p>
            <p className="text-3xl font-bold text-green-600">{inspections.filter(i => i.status === 'Completed').length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600">In Progress</p>
            <p className="text-3xl font-bold text-blue-600">{inspections.filter(i => i.status === 'In Progress').length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">{inspections.filter(i => i.status === 'Pending').length}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Facility</th>
                <th className="px-6 py-3 text-left font-semibold">Type</th>
                <th className="px-6 py-3 text-left font-semibold">Status</th>
                <th className="px-6 py-3 text-left font-semibold">Date</th>
                <th className="px-6 py-3 text-left font-semibold">Inspector</th>
                <th className="px-6 py-3 text-left font-semibold">Findings</th>
              </tr>
            </thead>
            <tbody>
              {inspections.map((inspection) => (
                <tr key={inspection.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-3">{inspection.facility}</td>
                  <td className="px-6 py-3">{inspection.type}</td>
                  <td className="px-6 py-3"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(inspection.status)}`}>{inspection.status}</span></td>
                  <td className="px-6 py-3">{inspection.date}</td>
                  <td className="px-6 py-3">{inspection.inspector}</td>
                  <td className="px-6 py-3">{inspection.findings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
