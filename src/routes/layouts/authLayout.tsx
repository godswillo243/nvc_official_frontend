import { Outlet, Link } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-300 flex flex-col items-center justify-center">
      {/* Optional Header */}
      <header className="w-full p-4 text-center bg-white shadow-md">
        <Link to="/" className="text-2xl font-bold text-green-800">NVC</Link>
      </header>

      {/* Main Content Area (will be populated by nested routes like Login or Signup) */}
      <main className="flex-1 w-full max-w-md bg-white shadow-lg rounded-lg p-8 mt-8">
        <Outlet />
      </main>

      {/* Optional Footer */}
      <footer className="w-full text-center py-4 mt-8 bg-white shadow-md">
        <p className="text-sm text-gray-700">
          &copy; {new Date().getFullYear()} NVC. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
