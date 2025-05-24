import { useState, type FormEvent } from "react";
import { useSignup } from "../../lib/react-query/mutations";
// import { Link } from "react-router-dom";
import { toast } from "react-toastify";

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

  console.log(form);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
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
    </div>
  );
}

export default Signup;
