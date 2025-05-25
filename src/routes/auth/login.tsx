import { useState, type FormEvent } from "react";
import { useLogin } from "../../lib/react-query/mutations";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const { mutate: login, isPending } = useLogin();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.name;
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // if (!form.email || !form.password) {
    //   toast.error("Please fill in all fields.");
    //   return;
    // }
    console.log(form)

    login(form, {
      onError(error) {
        console.log(error);
      },
      onSuccess(data) {
        console.log(data);
        toast.success("User registered successfully!");
        setForm({
          email: "",
          password: "",
        });
      },
    });
  }

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form id="registrationForm" onSubmit={(e) => handleSubmit(e)}>
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
          {isPending ? "Logging in" : "Login"}
        </button>
      </form>
      <p className="text-center mt-4  text-gray-800">
        Don't have an account?{" "}
        <Link to="/auth/signup" className="text-blue-500 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}

export default Login;
