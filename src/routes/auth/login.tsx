import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="flex-center-column max-h-full max-w-full overflow-hidden gap-4 p-4 w-full">
      <h1 className="text-4xl font-bold text-foreground text-center">
        L<span className="text-primary">o</span>gin
      </h1>
      <form className="flex flex-col gap-6 bg-primary/10 backdrop-blur-2xl p-4 rounded-md shadow-md m-auto w-[min(100%,400px)] max-w-sm">
        <div className="flex flex-col gap-2">
          <label
            className="text-lg font-semibold uppercase text-foreground "
            htmlFor="email"
          >
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="bg-white outline-0 p-2 rounded"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="text-lg font-semibold uppercase text-foreground "
            htmlFor="password"
          >
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            className="bg-white outline-0 p-2 rounded"
          />
        </div>
        <div className="flex justify-between items-center">
          <a
            href="#"
            className="text-sm underline text-blue-600  cursor-pointer"
          >
            Forgot Password
          </a>
        </div>
        <button type="submit" className="btn">
          Login
        </button>
        <p className="text-sm text-center text-foreground flex-center gap-2">
          Don't have an account?
          <Link
            to="/auth/signup"
            className="text-sm underline text-blue-600  cursor-pointer"
          >
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
