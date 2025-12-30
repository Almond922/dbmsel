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
    { title: 'Users', count: stats.users, href: '/users', color: 'from-blue-500 to-blue-600', icon: '👥' },
    { title: 'Food Listings', count: stats.listings, href: '/food-listings', color: 'from-green-500 to-green-600', icon: '🍲' },
    { title: 'Requests', count: stats.requests, href: '/requests', color: 'from-amber-500 to-amber-600', icon: '📋' },
    { title: 'Assignments', count: stats.assignments, href: '/assignments', color: 'from-purple-500 to-purple-600', icon: '🚚' },
  ];

  const quickLinks = [
    { title: 'Manage Users', description: 'Add, edit, or remove users', href: '/users', icon: '👤', color: 'blue' },
    { title: 'Food Listings', description: 'Manage food donations', href: '/food-listings', icon: '🥘', color: 'green' },
    { title: 'Requests', description: 'Handle food requests', href: '/requests', icon: '📝', color: 'amber' },
    { title: 'Assignments', description: 'Track deliveries', href: '/assignments', icon: '🚛', color: 'purple' },
    { title: 'Feedback', description: 'View user feedback', href: '/feedback', icon: '⭐', color: 'indigo' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600 text-lg">Welcome back! Here's an overview of your food donation system.</p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {cards.map((card) => (
            <Link key={card.href} href={card.href}>
              <div className={`bg-gradient-to-br ${card.color} text-white rounded-xl shadow-lg p-5 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs opacity-90 font-medium tracking-wide">{card.title}</p>
                    <p className="text-3xl font-bold mt-1 group-hover:scale-110 transition-transform">{card.count}</p>
                  </div>
                  <span className="text-4xl opacity-80 group-hover:scale-110 transition-transform">{card.icon}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Links Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Quick Access</h2>
            <p className="text-gray-600">Quickly navigate to key areas of the system</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <div className="p-4 border-2 border-gray-100 rounded-lg hover:border-gray-300 hover:shadow-md transition-all duration-300 group cursor-pointer h-full flex flex-col">
                  <span className="text-3xl mb-2 group-hover:scale-110 transition-transform inline-block">{link.icon}</span>
                  <h3 className="font-semibold text-gray-900 mb-1 text-base">{link.title}</h3>
                  <p className="text-xs text-gray-500 flex-grow">{link.description}</p>
                  <div className="mt-2 text-xs font-medium text-gray-400 group-hover:text-gray-600 transition-colors flex items-center">
                    Visit <span className="ml-1">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-gray-600 text-sm mb-1">Total Users</p>
            <p className="text-2xl font-bold text-blue-600">{stats.users}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-gray-600 text-sm mb-1">Active Listings</p>
            <p className="text-2xl font-bold text-green-600">{stats.listings}</p>
          </div>
          <div className="bg-amber-50 rounded-lg p-4">
            <p className="text-gray-600 text-sm mb-1">Pending Requests</p>
            <p className="text-2xl font-bold text-amber-600">{stats.requests}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-gray-600 text-sm mb-1">Active Assignments</p>
            <p className="text-2xl font-bold text-purple-600">{stats.assignments}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
