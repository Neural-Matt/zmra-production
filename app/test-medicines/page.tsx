'use client';

import { useEffect, useState } from 'react';

export default function TestMedicinesPage() {
  const [result, setResult] = useState<string>('Loading...');

  useEffect(() => {
    (async () => {
      try {
        window.console.log('[TEST] Starting fetch at:', new Date().toISOString());
        const response = await fetch('/api/medicines');
        window.console.log('[TEST] Got response:', response.status);
        const data = await response.json();
        window.console.log('[TEST] Parsed data:', data);
        setResult(`Success! Got ${data.medicines?.length || 0} medicines. First: ${data.medicines?.[0]?.brandName || 'N/A'}`);
      } catch (e: any) {
        window.console.error('[TEST] Error:', e);
        setResult(`Error: ${e.message}`);
      }
    })();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Medicines Fetch</h1>
      <p className="text-lg">{result}</p>
    </div>
  );
}
