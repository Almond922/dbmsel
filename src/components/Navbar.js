import Link from 'next/link';

export default function Navbar() {
  const navItems = [
    { href: '/', label: 'Dashboard' },
    { href: '/users', label: 'Users' },
    { href: '/food-listings', label: 'Food Listings' },
    { href: '/requests', label: 'Requests' },
    { href: '/assignments', label: 'Assignments' },
    { href: '/feedback', label: 'Feedback' },
  ];

  return (
    <nav className="bg-green-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="font-bold text-xl">
            🍽️ Food Donation
          </Link>
          <div className="flex space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:bg-green-700 px-3 py-2 rounded transition"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
