'use client';

import { useState, useEffect } from 'react';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [formData, setFormData] = useState({ title: '', type: '', file: '' });

  useEffect(() => {
    setDocuments([
      { id: 1, title: 'Paracetamol Safety Profile', type: 'Safety Report', category: 'Safety', uploadDate: '2026-04-01', uploadedBy: 'Dr. Smith' },
      { id: 2, title: 'Ibuprofen Manufacturing Process', type: 'Technical Doc', category: 'Manufacturing', uploadDate: '2026-04-02', uploadedBy: 'Eng. Kumar' },
      { id: 3, title: 'Aspirin Clinical Trials', type: 'Research', category: 'Research', uploadDate: '2026-04-03', uploadedBy: 'Dr. Patel' },
      { id: 4, title: 'Vitamin C Quality Certificate', type: 'Certificate', category: 'Quality', uploadDate: '2026-04-04', uploadedBy: 'QA Manager' },
      { id: 5, title: 'Regulatory Compliance Report Q1', type: 'Compliance', category: 'Regulatory', uploadDate: '2026-04-05', uploadedBy: 'Legal Team' },
    ]);
  }, []);

  const handleUpload = () => {
    if (formData.title && formData.type) {
      setDocuments([...documents, {
        id: documents.length + 1,
        title: formData.title,
        type: formData.type,
        category: 'General',
        uploadDate: new Date().toISOString().split('T')[0],
        uploadedBy: 'Current User'
      }]);
      setFormData({ title: '', type: '', file: '' });
      setShowUpload(false);
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      'Safety Report': 'bg-red-100 text-red-800',
      'Technical Doc': 'bg-blue-100 text-blue-800',
      'Research': 'bg-purple-100 text-purple-800',
      'Certificate': 'bg-green-100 text-green-800',
      'Compliance': 'bg-yellow-100 text-yellow-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Documents & Files</h1>
          <button onClick={() => setShowUpload(!showUpload)} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            {showUpload ? 'Cancel' : '+ Upload Document'}
          </button>
        </div>

        {showUpload && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="grid md:grid-cols-2 gap-4">
              <input type="text" placeholder="Document Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="border p-2 rounded" />
              <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="border p-2 rounded">
                <option value="">Select Document Type</option>
                <option value="Safety Report">Safety Report</option>
                <option value="Technical Doc">Technical Documentation</option>
                <option value="Research">Research Paper</option>
                <option value="Certificate">Certificate</option>
                <option value="Compliance">Compliance Report</option>
              </select>
            </div>
            <button onClick={handleUpload} className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">Upload</button>
          </div>
        )}

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600">Total Documents</p>
            <p className="text-3xl font-bold">{documents.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600">This Month</p>
            <p className="text-3xl font-bold">{documents.filter(d => d.uploadDate.startsWith('2026-04')).length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600">Safety Reports</p>
            <p className="text-3xl font-bold">{documents.filter(d => d.type === 'Safety Report').length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600">Certificates</p>
            <p className="text-3xl font-bold">{documents.filter(d => d.type === 'Certificate').length}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Title</th>
                <th className="px-6 py-3 text-left font-semibold">Type</th>
                <th className="px-6 py-3 text-left font-semibold">Upload Date</th>
                <th className="px-6 py-3 text-left font-semibold">Uploaded By</th>
                <th className="px-6 py-3 text-left font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-3">{doc.title}</td>
                  <td className="px-6 py-3"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(doc.type)}`}>{doc.type}</span></td>
                  <td className="px-6 py-3">{doc.uploadDate}</td>
                  <td className="px-6 py-3">{doc.uploadedBy}</td>
                  <td className="px-6 py-3"><button className="text-blue-600 hover:underline">Download</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
