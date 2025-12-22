import Link from 'next/link';
import pool from '@/lib/db';

async function getStats() {
  try {
    const [users] = await pool.query('SELECT COUNT(*) as count FROM Users');
    const [listings] = await pool.query('SELECT COUNT(*) as count FROM Food_Listings');
    const [requests] = await pool.query('SELECT COUNT(*) as count FROM Requests');
    const [assignments] = await pool.query('SELECT COUNT(*) as count FROM Assignments');
    
    return {
      users: users[0].count,
      listings: listings[0].count,
      requests: requests[0].count,
      assignments: assignments[0].count,
    };
  } catch (error) {
    console.error('Database error:', error);
    return { users: 0, listings: 0, requests: 0, assignments: 0 };
  }
}

export default async function Dashboard() {
  const stats = await getStats();

  const cards = [
    { title: 'Users', count: stats.users, href: '/users', color: 'bg-blue-500', icon: '👥' },
    { title: 'Food Listings', count: stats.listings, href: '/food-listings', color: 'bg-green-500', icon: '🍲' },
    { title: 'Requests', count: stats.requests, href: '/requests', color: 'bg-yellow-500', icon: '📋' },
    { title: 'Assignments', count: stats.assignments, href: '/assignments', color: 'bg-purple-500', icon: '🚚' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card) => (
          <Link key={card.href} href={card.href}>
            <div className={`${card.color} text-white rounded-lg shadow-lg p-6 hover:opacity-90 transition`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">{card.title}</p>
                  <p className="text-3xl font-bold">{card.count}</p>
                </div>
                <span className="text-4xl">{card.icon}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Links</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Link href="/users" className="p-4 border rounded-lg hover:bg-gray-50 transition">
            <h3 className="font-medium">Manage Users</h3>
            <p className="text-sm text-gray-500">Add, edit, or remove users</p>
          </Link>
          <Link href="/food-listings" className="p-4 border rounded-lg hover:bg-gray-50 transition">
            <h3 className="font-medium">Food Listings</h3>
            <p className="text-sm text-gray-500">Manage food donations</p>
          </Link>
          <Link href="/requests" className="p-4 border rounded-lg hover:bg-gray-50 transition">
            <h3 className="font-medium">Requests</h3>
            <p className="text-sm text-gray-500">Handle food requests</p>
          </Link>
          <Link href="/assignments" className="p-4 border rounded-lg hover:bg-gray-50 transition">
            <h3 className="font-medium">Assignments</h3>
            <p className="text-sm text-gray-500">Track deliveries</p>
          </Link>
          <Link href="/feedback" className="p-4 border rounded-lg hover:bg-gray-50 transition">
            <h3 className="font-medium">Feedback</h3>
            <p className="text-sm text-gray-500">View user feedback</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
