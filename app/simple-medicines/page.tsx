'use client';

import { useEffect, useState } from 'react';

export default function SimpleMedicinesTest() {
  const [medicines, setMedicines] = useState<{id: string, name: string}[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('[EFFECT START]');
    
    fetch('/api/medicines')
      .then((r) => {
        console.log('[FETCH RESPONSE]', r.status);
        return r.json();
      })
      .then((data) => {
        console.log('[JSON PARSED]', data.medicines?.length);
        const simple = data.medicines.map((m: any) => ({
          id: m.id,
          name: m.brandName,
        }));
        console.log('[SETTING STATE]', simple.length);
        setMedicines(simple);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('[ERROR]', err.message);
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  if (error) {
    return <div className="p-8 text-red-600"><h1>Error: {error}</h1></div>;
  }

  if (isLoading) {
    return <div className="p-8"><div className="animate-spin">Loading...</div></div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Medicines ({medicines.length})</h1>
      <div className="max-h-96 overflow-y-auto border border-gray-300 rounded">
        {medicines.map((m) => (
          <div key={m.id} className="p-2 border-b hover:bg-gray-100">
            {m.name}
          </div>
        ))}
      </div>
    </div>
  );
}
