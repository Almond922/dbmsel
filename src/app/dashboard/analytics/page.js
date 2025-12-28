"use client";
import { useEffect, useState } from "react";

export default function AnalyticsDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/analytics")
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) return <p>Loading analytics...</p>;

  return (
    <div>
      <h1>Analytics Dashboard</h1>

      <section>
        <h2>Donations Over Time</h2>
        <pre>{JSON.stringify(data.donationsPerDay, null, 2)}</pre>
      </section>

      <section>
        <h2>Expired vs Delivered</h2>
        <pre>{JSON.stringify(data.statusStats, null, 2)}</pre>
      </section>

      <section>
        <h2>NGO Acceptance Rate</h2>
        <pre>{JSON.stringify(data.ngoAcceptance, null, 2)}</pre>
      </section>
    </div>
  );
}
