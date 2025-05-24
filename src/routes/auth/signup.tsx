import React, { useState } from "react";

export default function signup() {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    nin: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Helper: create username from fullname
  const createUserRoute = (fullname: string) => {
    return fullname
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-"); // replace spaces with dashes
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const usernameRoute = createUserRoute(formData.fullname);

      const response = await fetch(
        `https://nvc-api.onrender.com/user/${usernameRoute}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Registration failed");

      const data = await response.json();
      alert("Registration successful!");
      console.log(data);
      // Optionally clear form or redirect
    } catch (error) {
      alert("Error during registration.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#1e3c72] to-[#2a5298] px-4"
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-black bg-opacity-70 text-white rounded-lg shadow-lg p-8 max-w-md w-full
                   animate-fadeIn"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">Create Account</h2>

        <label htmlFor="fullname" className="block text-sm mb-1">
          Full Name
        </label>
        <input
          type="text"
          id="fullname"
          name="fullname"
          required
          value={formData.fullname}
          onChange={handleChange}
          className="w-full mb-5 px-3 py-2 rounded-md bg-[#333] text-white border border-gray-600
                     focus:border-green-500 outline-none transition"
        />

        <label htmlFor="email" className="block text-sm mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full mb-5 px-3 py-2 rounded-md bg-[#333] text-white border border-gray-600
                     focus:border-green-500 outline-none transition"
        />

        <label htmlFor="phone" className="block text-sm mb-1">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          required
          value={formData.phone}
          onChange={handleChange}
          className="w-full mb-5 px-3 py-2 rounded-md bg-[#333] text-white border border-gray-600
                     focus:border-green-500 outline-none transition"
        />

        <label htmlFor="nin" className="block text-sm mb-1">
          Nigerian NIN
        </label>
        <input
          type="text"
          id="nin"
          name="nin"
          pattern="\d{11}"
          title="NIN must be 11 digits"
          required
          value={formData.nin}
          onChange={handleChange}
          className="w-full mb-5 px-3 py-2 rounded-md bg-[#333] text-white border border-gray-600
                     focus:border-green-500 outline-none transition"
        />

        <label htmlFor="password" className="block text-sm mb-1">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          required
          value={formData.password}
          onChange={handleChange}
          className="w-full mb-6 px-3 py-2 rounded-md bg-[#333] text-white border border-gray-600
                     focus:border-green-500 outline-none transition"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-green-600 rounded-md font-semibold hover:bg-green-700
                     transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <style>
        {`
          @keyframes fadeIn {
            from {opacity: 0; transform: translateY(20px);}
            to {opacity: 1; transform: translateY(0);}
          }
          .animate-fadeIn {
            animation: fadeIn 0.8s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
}
