'use client';

import { useState, useEffect } from 'react';

export default function LaboratoryPage() {
  const [tests, setTests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ medicineName: '', testType: '', result: '' });

  useEffect(() => {
    setTests([
      { id: 1, medicine: 'Paracetamol', type: 'Potency', result: 'Pass', date: '2026-04-01', testedBy: 'Dr. Smith' },
      { id: 2, medicine: 'Ibuprofen', type: 'Dissolution', result: 'Pass', date: '2026-04-02', testedBy: 'Dr. Johnson' },
      { id: 3, medicine: 'Aspirin', type: 'Microbial', result: 'Pass', date: '2026-04-03', testedBy: 'Dr. Williams' },
      { id: 4, medicine: 'Vitamin C', type: 'Moisture', result: 'Fail', date: '2026-04-04', testedBy: 'Dr. Brown' },
    ]);
  }, []);

  const handleAddTest = () => {
    if (formData.medicineName && formData.testType) {
      setTests([...tests, {
        id: tests.length + 1,
        medicine: formData.medicineName,
        type: formData.testType,
        result: formData.result,
        date: new Date().toISOString().split('T')[0],
        testedBy: 'Lab Technician'
      }]);
      setFormData({ medicineName: '', testType: '', result: '' });
      setShowForm(false);
    }
  };

  const getResultBadge = (result) => {
    return result === 'Pass' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Laboratory Testing</h1>
          <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            {showForm ? 'Cancel' : '+ New Test'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="grid md:grid-cols-3 gap-4">
              <input type="text" placeholder="Medicine Name" value={formData.medicineName} onChange={(e) => setFormData({...formData, medicineName: e.target.value})} className="border p-2 rounded" />
              <select value={formData.testType} onChange={(e) => setFormData({...formData, testType: e.target.value})} className="border p-2 rounded">
                <option value="">Select Test Type</option>
                <option value="Potency">Potency</option>
                <option value="Dissolution">Dissolution</option>
                <option value="Microbial">Microbial</option>
                <option value="Moisture">Moisture</option>
              </select>
              <select value={formData.result} onChange={(e) => setFormData({...formData, result: e.target.value})} className="border p-2 rounded">
                <option value="">Select Result</option>
                <option value="Pass">Pass</option>
                <option value="Fail">Fail</option>
              </select>
            </div>
            <button onClick={handleAddTest} className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">Save Test</button>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600">Total Tests</p>
            <p className="text-3xl font-bold text-blue-600">{tests.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600">Passed</p>
            <p className="text-3xl font-bold text-green-600">{tests.filter(t => t.result === 'Pass').length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600">Failed</p>
            <p className="text-3xl font-bold text-red-600">{tests.filter(t => t.result === 'Fail').length}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Medicine</th>
                <th className="px-6 py-3 text-left font-semibold">Test Type</th>
                <th className="px-6 py-3 text-left font-semibold">Result</th>
                <th className="px-6 py-3 text-left font-semibold">Date</th>
                <th className="px-6 py-3 text-left font-semibold">Tested By</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((test) => (
                <tr key={test.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-3">{test.medicine}</td>
                  <td className="px-6 py-3">{test.type}</td>
                  <td className="px-6 py-3"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${getResultBadge(test.result)}`}>{test.result}</span></td>
                  <td className="px-6 py-3">{test.date}</td>
                  <td className="px-6 py-3">{test.testedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
