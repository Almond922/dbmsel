'use client';

import Link from 'next/link';

export default function Navbar() {
  const navItems = [
    { href: '/', label: 'Dashboard' },
    { href: '/users', label: 'Users' },
    { href: '/food-listings', label: 'Food Listings' },
    { href: '/requests', label: 'Requests' },
    { href: '/assignments', label: 'Assignments' },
    { href: '/admin/assignments', label: 'Admin' },
    { href: '/feedback', label: 'Feedback' },
  ];

  return (
    <nav className="bg-green-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="font-bold text-xl">
            🍽️ Food Donation
          </Link>
          <div className="flex space-x-4 items-center">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:bg-green-700 px-3 py-2 rounded transition"
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={async () => {
                await fetch('/api/auth/logout', { method: 'POST' });
                window.location.href = '/login';
              }}
              className="hover:bg-green-700 px-3 py-2 rounded transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
