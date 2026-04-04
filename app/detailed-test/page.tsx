'use client';

import { useEffect, useState } from 'react';

export default function DetailedTestPage() {
  const [log, setLog] = useState<string[]>(['Initializing...']);

  const addLog = (msg: string) => {
    console.log('[LOG]', msg);
    setLog(prev => [...prev, msg]);
  };

  useEffect(() => {
    addLog('useEffect started');

    const testFetch = async () => {
      try {
        addLog('About to fetch /api/medicines');
        const startTime = Date.now();
        
        const response = await fetch('/api/medicines');
        const fetchTime = Date.now() - startTime;
        
        addLog(`Fetch completed in ${fetchTime}ms, status: ${response.status}`);
        
        const responseText = await response.text();
        addLog(`Response size: ${responseText.length} bytes`);
        
        const data = JSON.parse(responseText);
        addLog(`JSON parsed successfully`);
        addLog(`medicines field exists: ${data.medicines !== undefined}`);
        addLog(`medicines is array: ${Array.isArray(data.medicines)}`);
        addLog(`medicines count: ${data.medicines?.length || 0}`);
        
        if (data.medicines && data.medicines.length > 0) {
          addLog(`First medicine: ${data.medicines[0].brandName}`);
        }
      } catch (error: any) {
        addLog(`ERROR: ${error.message}`);
        addLog(`Error type: ${error.constructor.name}`);
      }
    };

    testFetch();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Detailed Test Log</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        {log.map((message, i) => (
          <div key={i} className="font-mono text-sm py-1 border-b border-gray-200 last:border-b-0">
            <span className={`${message.includes('ERROR') ? 'text-red-600 font-bold' : 'text-gray-700'}`}>
              {i + 1}. {message}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
