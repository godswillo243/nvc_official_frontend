import { Outlet, Link } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-br from-green-100 to-green-300 px-4 py-6">
      
      {/* Header */}
      <header className="w-full max-w-4xl bg-white/80 backdrop-blur-md shadow-md rounded-lg py-4 px-6 mb-4">
        <div className="text-center">
          <Link to="/" className="text-3xl font-bold text-green-800 tracking-tight hover:opacity-80 transition">
            NVC
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-md bg-white/90 backdrop-blur-lg shadow-xl rounded-xl p-8 my-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="w-full max-w-4xl bg-white/80 backdrop-blur-md shadow-md rounded-lg py-3 px-4 text-center mt-4">
        <p className="text-sm text-gray-600">
          &copy; {new Date().getFullYear()} NVC. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
￼Enter
