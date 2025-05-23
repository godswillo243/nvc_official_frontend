import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function LoginRoute() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimate(true), 100); // Delay to trigger animations
  }, []);

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-gradient-to-br from-green-100 to-green-300 px-4">
      {/* Logo with animation */}
      <div className="animate-bounce mb-8">
        <img src="/logo.png" alt="Logo" className="h-20 w-20" />
      </div>

      {/* Form */}
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center text-green-800">Login</h2>

        <div className={`transition-all duration-500 ${animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6"}`}>
          <label className="block mb-1 font-medium text-gray-700">Email</label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter your email"
          />
        </div>

        <div className={`transition-all duration-500 delay-100 ${animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6"}`}>
          <label className="block mb-1 font-medium text-gray-700">Password</label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter your password"
          />
        </div>

        <div className={`text-right text-sm text-green-700 hover:underline transition-all duration-500 delay-200 ${animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6"}`}>
          <Link to="/auth/forgot-password">Forgot your password?</Link>
        </div>

        <div className={`transition-all duration-500 delay-[300ms] ${animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6"}`}>
          <button className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-2 rounded-full font-semibold hover:opacity-90 transition">
            Login
          </button>
        </div>

        <div className={`text-center text-sm transition-all duration-500 delay-[400ms] ${animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6"}`}>
          Don’t have an account?{" "}
          <Link to="/auth/signup" className="text-green-700 hover:underline font-medium">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
