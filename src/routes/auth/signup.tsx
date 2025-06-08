import { useState, type FormEvent } from "react";
import { useSignup } from "../../lib/react-query/mutations";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    nin: "",
    phone_number: "",
  });

  const { mutate: signup, isPending } = useSignup();
  const navigate = useNavigate();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const { name, email, password, confirmPassword, phone_number, nin } = form;

    // Basic validation
    if (!name || !email || !password || !confirmPassword || !phone_number) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match. Please make sure both password fields are identical.");
      return;
    }

    const trimmedNin = nin.trim();

    // Validate only if user entered a NIN
    if (trimmedNin && trimmedNin.length !== 11) {
      toast.error("If provided, NIN must be exactly 11 digits.");
      return;
    }

    // Use *********** if NIN is not provided
    const safeNin = trimmedNin === "" ? "***********" : trimmedNin;

    const payload = {
      name,
      email,
      password,
      phone_number,
      nin: safeNin,
    };

    signup(payload, {
      onError(error: any) {
        toast.error(error?.message || "Signup failed. Please try again.");
      },
      onSuccess() {
        toast.success("User registered successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/auth/login");
        }, 1000);
      },
    });
  }

  return (
    <div className="form-container">
      <h2>Register</h2>
      <form id="registrationForm" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            onChange={handleChange}
            value={form.name}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            onChange={handleChange}
            value={form.email}
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone_number">Phone Number</label>
          <input
            type="tel"
            id="phone_number"
            name="phone_number"
            required
            onChange={handleChange}
            value={form.phone_number}
          />
        </div>

        <div className="form-group">
          <label htmlFor="nin">Nigerian NIN (optional)</label>
          <input
            type="text"
            id="nin"
            name="nin"
            onChange={handleChange}
            value={form.nin}
            placeholder="11-digit NIN"
            maxLength={11}
            pattern="\d*"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            minLength={8}
            required
            onChange={handleChange}
            value={form.password}
            placeholder="At least 8 characters"
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            required
            onChange={handleChange}
            value={form.confirmPassword}
            placeholder="Re-enter your password"
          />
        </div>

        <button type="submit" disabled={isPending}>
          {isPending ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <p className="text-center mt-4 text-gray-800">
        Already have an account?{" "}
        <Link to="/auth/login" className="text-blue-500 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}

export default Signup;
