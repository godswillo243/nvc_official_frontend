import React, { useState } from "react";

export default function Signup() {
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

  const createUserRoute = (fullname: string) => {
    return fullname.trim().toLowerCase().replace(/\s+/g, "-");
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
    } catch (error) {
      alert("Error during registration.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-700 px-4 font-sans">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 bg-opacity-80 text-white rounded-lg shadow-lg p-8 w-full max-w-md animate-fadeIn"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">Create Account</h2>

        {[
          { label: "Full Name", name: "fullname", type: "text" },
          { label: "Email", name: "email", type: "email" },
          { label: "Phone Number", name: "phone", type: "tel" },
          {
            label: "Nigerian NIN",
            name: "nin",
            type: "text",
            pattern: "\\d{11}",
            title: "NIN must be 11 digits",
          },
          { label: "Password", name: "password", type: "password" },
        ].map((field, index) => (
          <div key={index} className="mb-5">
            <label htmlFor={field.name} className="block text-sm mb-1">
              {field.label}
            </label>
            <input
              {...field}
              required
              value={formData[field.name as keyof typeof formData]}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:border-green-500 focus:ring-2 focus:ring-green-500 outline-none transition"
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-green-600 rounded-md font-semibold hover:bg-green-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.8s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
}
