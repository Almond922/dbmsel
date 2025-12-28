'use client';
import { useEffect, useState } from 'react';

export default function AnalyticsPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/analytics')
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) return <p>Loading analytics...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>

      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify(data, null, 2)}
      </pre>

      {/* Charts come next */}
    </div>
  );
}

