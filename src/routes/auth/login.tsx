import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function LoginRoute() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimate(true), 100);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-full w-full space-y-8">
      {/* Logo */}
      <div className="mb-2">
        <img
          src="/logo.png"
          alt="NVC Logo"
          className="h-16 w-16 animate-bounce shadow-lg bg-white rounded-full p-1"
        />
      </div>

      {/* Social-style caption */}
      <h1 className="text-center text-2xl font-semibold text-gray-800">
        Sign in to continue to{" "}
        <span className="text-green-600 font-bold tracking-tight">NVC</span>
      </h1>

      {/* Form card */}
      <div className="w-full bg-white/90 backdrop-blur-lg shadow-xl rounded-xl p-8 space-y-6">
        {/* Email Field */}
        <div
          className={`transition-all duration-500 ${animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
        >
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="you@example.com"
          />
        </div>

        {/* Password Field */}
        <div
          className={`transition-all duration-500 delay-100 ${animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
        >
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="••••••••"
          />
        </div>

        {/* Forgot Password */}
        <div
          className={`text-right text-sm text-green-700 hover:underline transition-all duration-500 delay-200 ${animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
        >
          <Link to="/auth/forgot-password">Forgot password?</Link>
        </div>

        {/* Login Button */}
        <div
          className={`transition-all duration-500 delay-300 ${animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
        >
          <button className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-2.5 rounded-full font-semibold hover:opacity-90 hover:shadow-lg transition">
            Sign In
          </button>
        </div>

        {/* Sign up link */}
        <div
          className={`text-center text-sm transition-all duration-500 delay-400 ${animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
        >
          Don’t have an account?{" "}
          <Link to="/auth/signup" className="text-green-700 hover:underline font-medium">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
