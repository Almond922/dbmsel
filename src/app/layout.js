import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Food Donation Management",
  description: "Manage food donations, requests, and assignments",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
