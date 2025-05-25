import { useState, type FormEvent } from "react";
import { useSignup } from "../../lib/react-query/mutations";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    nin: "",
    phone_number: "",
  });

  const { mutate: signup, isPending } = useSignup();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.name;
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.nin ||
      !form.phone_number
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    signup(form, {
      onError(error) {
        console.log(error);
      },
      onSuccess(data) {
        console.log(data);
        toast.success("User registered successfully!");
        setForm({
          email: "",
          name: "",
          nin: "",
          password: "",
          phone_number: "",
        });
      },
    });
  }

  return (
    <div className="form-container">
      <h2>Register</h2>
      <form id="registrationForm" onSubmit={(e) => handleSubmit(e)}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            onChange={(e) => handleChange(e)}
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
            onChange={(e) => handleChange(e)}
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
            onChange={(e) => handleChange(e)}
            value={form.phone_number}
          />
        </div>

        <div className="form-group">
          <label htmlFor="nin">Nigerian NIN</label>
          <input
            type="text"
            id="nin"
            name="nin"
            pattern="\d{11}"
            maxLength={11}
            required
            onChange={(e) => handleChange(e)}
            value={form.nin}
            placeholder="11-digit NIN"
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
            onChange={(e) => handleChange(e)}
            value={form.password}
            placeholder="At least 8 characters"
          />
        </div>

        <button type="submit" disabled={isPending}>
          {isPending ? "Creating Account..." : "Create Account"}
        </button>
      </form>
      <p className="text-center mt-4  text-gray-800">
        Already have an account?{" "}
        <Link to="/auth/login" className="text-blue-500 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}

export default Signup;
