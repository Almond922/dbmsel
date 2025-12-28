'use client';

import { useEffect, useState } from 'react';

function formatRemaining(ms) {
  if (ms <= 0) return 'Expired';
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / (24 * 3600));
  const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (days > 0) return `in ${days}d ${hours}h`;
  if (hours > 0) return `in ${hours}h ${minutes}m`;
  return `in ${minutes}m`;
}

export default function ExpiryBadge({ expiryTime }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60 * 1000); // update every minute
    return () => clearInterval(t);
  }, []);

  if (!expiryTime) return null;

  // accept either ISO string or SQL datetime
  const expiry = new Date(expiryTime);
  const diff = expiry - now;

  // thresholds in ms
  const sixHours = 6 * 60 * 60 * 1000;

  let color = 'bg-green-100 text-green-800';
  if (diff <= 0) color = 'bg-red-100 text-red-800';
  else if (diff <= sixHours) color = 'bg-yellow-100 text-yellow-800';

  const text = diff <= 0 ? 'Expired' : formatRemaining(diff);

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium ${color}`}> {text} </span>
  );
}
