'use client';

import { useState, useEffect } from 'react';

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState([]);

  useEffect(() => {
    setApprovals([
      { id: 1, medicine: 'Paracetamol', status: 'Pending', submittedBy: 'John Doe', date: '2026-04-01', action: 'Review Needed' },
      { id: 2, medicine: 'Ibuprofen', status: 'Approved', submittedBy: 'Jane Smith', date: '2026-03-28', action: 'Approved' },
      { id: 3, medicine: 'Cough Syrup', status: 'Pending', submittedBy: 'Mike Johnson', date: '2026-04-02', action: 'Review Needed' },
      { id: 4, medicine: 'Vitamin C', status: 'Rejected', submittedBy: 'Sarah Wilson', date: '2026-03-25', action: 'Rejected' },
    ]);
  }, []);

  const handleApprove = (id) => {
    setApprovals(approvals.map(a => a.id === id ? {...a, status: 'Approved', action: 'Approved'} : a));
  };

  const handleReject = (id) => {
    setApprovals(approvals.map(a => a.id === id ? {...a, status: 'Rejected', action: 'Rejected'} : a));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Approvals Workflow</h1>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600">Total Requests</p>
            <p className="text-3xl font-bold text-blue-600">{approvals.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">{approvals.filter(a => a.status === 'Pending').length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600">Approved</p>
            <p className="text-3xl font-bold text-green-600">{approvals.filter(a => a.status === 'Approved').length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600">Rejected</p>
            <p className="text-3xl font-bold text-red-600">{approvals.filter(a => a.status === 'Rejected').length}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Medicine</th>
                <th className="px-6 py-3 text-left font-semibold">Submitted By</th>
                <th className="px-6 py-3 text-left font-semibold">Date</th>
                <th className="px-6 py-3 text-left font-semibold">Status</th>
                <th className="px-6 py-3 text-left font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {approvals.map((approval) => (
                <tr key={approval.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-3 font-semibold">{approval.medicine}</td>
                  <td className="px-6 py-3">{approval.submittedBy}</td>
                  <td className="px-6 py-3">{approval.date}</td>
                  <td className="px-6 py-3"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(approval.status)}`}>{approval.status}</span></td>
                  <td className="px-6 py-3 space-x-2">
                    {approval.status === 'Pending' && (
                      <>
                        <button onClick={() => handleApprove(approval.id)} className="text-green-600 hover:underline font-semibold">Approve</button>
                        <button onClick={() => handleReject(approval.id)} className="text-red-600 hover:underline font-semibold">Reject</button>
                      </>
                    )}
                    {approval.status !== 'Pending' && <span className="text-gray-500">{approval.action}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
