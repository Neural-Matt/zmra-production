'use client';

import { useState, useEffect } from 'react';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    setAlerts([
      { id: 1, type: 'Low Stock', message: 'Paracetamol stock below threshold', severity: 'warning', date: '2026-04-15', status: 'Active' },
      { id: 2, type: 'Expiry', message: 'Ibuprofen batch expires in 7 days', severity: 'critical', date: '2026-04-15', status: 'Active' },
      { id: 3, type: 'Quality Issue', message: 'Vitamin C test result failed', severity: 'critical', date: '2026-04-14', status: 'Active' },
      { id: 4, type: 'Inspection Due', message: 'Cold storage inspection due', severity: 'info', date: '2026-04-14', status: 'Active' },
      { id: 5, type: 'Approval Pending', message: 'New medicine batch awaiting approval', severity: 'info', date: '2026-04-13', status: 'Resolved' },
      { id: 6, type: 'Low Stock', message: 'Aspirin inventory at 5% capacity', severity: 'warning', date: '2026-04-13', status: 'Resolved' },
    ]);
  }, []);

  const getSeverityColor = (severity) => {
    const colors = {
      'critical': 'bg-red-100 text-red-800 border-red-300',
      'warning': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'info': 'bg-blue-100 text-blue-800 border-blue-300'
    };
    return colors[severity] || 'bg-gray-100 text-gray-800';
  };

  const getSeverityIcon = (severity) => {
    const icons = {
      'critical': '🔴',
      'warning': '🟡',
      'info': '🔵'
    };
    return icons[severity] || '⚪';
  };

  const filteredAlerts = filter === 'All' ? alerts : alerts.filter(a => a.status === filter);
  const activeCount = alerts.filter(a => a.status === 'Active').length;
  const criticalCount = alerts.filter(a => a.severity === 'critical' && a.status === 'Active').length;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">System Alerts</h1>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600">Active Alerts</p>
            <p className="text-3xl font-bold text-orange-600">{activeCount}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600">Critical</p>
            <p className="text-3xl font-bold text-red-600">{criticalCount}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600">Warnings</p>
            <p className="text-3xl font-bold text-yellow-600">{alerts.filter(a => a.severity === 'warning').length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600">Info</p>
            <p className="text-3xl font-bold text-blue-600">{alerts.filter(a => a.severity === 'info').length}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Filter Alerts</h2>
          <div className="flex gap-2 flex-wrap">
            {['All', 'Active', 'Resolved'].map((status) => (
              <button key={status} onClick={() => setFilter(status)} className={`px-4 py-2 rounded-lg ${filter === status ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredAlerts.map((alert) => (
            <div key={alert.id} className={`border rounded-lg p-4 ${getSeverityColor(alert.severity)}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{getSeverityIcon(alert.severity)}</span>
                  <div>
                    <h3 className="font-bold">{alert.type}</h3>
                    <p className="text-sm">{alert.message}</p>
                    <p className="text-xs mt-1">Date: {alert.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold mb-2">{alert.status}</p>
                  {alert.status === 'Active' && (
                    <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700">Resolve</button>
                  )}
                  {alert.status === 'Resolved' && (
                    <button className="bg-gray-400 text-white px-3 py-1 rounded text-xs">Archived</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
