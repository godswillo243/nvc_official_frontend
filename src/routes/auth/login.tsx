import { useState, type FormEvent, useEffect } from "react";
import { useLogin, useRequestPasswordReset, useAuthStatus } from "../../lib/react-query/mutations";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [formErrors, setFormErrors] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockoutTimer, setLockoutTimer] = useState(0);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const { mutate: login, isPending } = useLogin();
  const { mutate: requestReset, isPending: isResetPending } = useRequestPasswordReset();
  const { isAuthenticated } = useAuthStatus();

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!isLockedOut) return;
    const timer = setInterval(() => {
      setLockoutTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsLockedOut(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isLockedOut]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }

  function validateForm() {
    let valid = true;
    const newErrors = { email: "", password: "" };
    if (!form.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email is invalid";
      valid = false;
    }
    if (!form.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      valid = false;
    }
    setFormErrors(newErrors);
    return valid;
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isLockedOut) {
      toast.error(`Too many attempts. Please try again in ${lockoutTimer} seconds.`);
      return;
    }
    if (!validateForm()) return;
    login(form, {
      onSuccess: () => {
        toast.success("Login successful!");
        setLoginAttempts(0);
      },
      onError: (error) => {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        if (newAttempts >= 3) {
          setIsLockedOut(true);
          setLockoutTimer(30);
          toast.error("Too many attempts. Please try again in 30 seconds.");
          return;
        }
        toast.error(
          error.status === 401
            ? `Invalid email or password (${newAttempts}/3 attempts)`
            : error.message || "Login failed. Please try again."
        );
      },
    });
  }

  function handlePasswordReset() {
    if (!resetEmail) {
      toast.error("Please enter your email address");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(resetEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }
    requestReset(resetEmail, {
      onSuccess: () => {
        toast.success("Password reset link sent to your email");
        setShowResetModal(false);
        setResetEmail("");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to send reset link");
      },
    });
  }

  const EyeIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  );

  const EyeOffIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
      <line x1="1" y1="1" x2="23" y2="23"></line>
    </svg>
  );

  return (
    <>
      <style>
        {`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            50% { transform: translateX(5px); }
            75% { transform: translateX(-5px); }
          }
          @keyframes zoomIn {
            0% { transform: scale(0.8); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          .animate-shake {
            animation: shake 0.3s ease-in-out;
          }
          .animate-zoomIn {
            animation: zoomIn 0.4s ease-out;
          }
        `}
      </style>

      <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow-lg transition-all duration-700 ease-in-out">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              onChange={handleChange}
              value={form.email}
              className={`mt-1 block w-full rounded-lg px-4 py-2 border ${
                formErrors.email ? "border-red-500 animate-shake" : "border-gray-300"
              } focus:ring-2 focus:ring-blue-500 focus:outline-none transition-transform focus:scale-[1.01]`}
              disabled={isLockedOut}
            />
            {formErrors.email && <p className="text-sm text-red-600 mt-1">{formErrors.email}</p>}
          </div>

          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              minLength={8}
              required
              onChange={handleChange}
              value={form.password}
              className={`mt-1 block w-full rounded-lg px-4 py-2 pr-10 border ${
                formErrors.password ? "border-red-500 animate-shake" : "border-gray-300"
              } focus:ring-2 focus:ring-blue-500 focus:outline-none transition-transform focus:scale-[1.01]`}
              placeholder="At least 8 characters"
              disabled={isLockedOut}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 top-[38px] pr-3 flex items-center"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
            {formErrors.password && <p className="text-sm text-red-600 mt-1">{formErrors.password}</p>}
          </div>

          <div className="text-right">
            <button
              type="button"
              onClick={() => setShowResetModal(true)}
              className="text-sm text-blue-600 hover:underline focus:outline-none"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isPending || isLockedOut}
            className={`w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 ${
              isPending || isLockedOut ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isPending ? "Logging in..." : isLockedOut ? `Try again in ${lockoutTimer}s` : "Login"}
          </button>

          <p className="text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link to="/auth/signup" className="text-blue-600 hover:underline">Sign up</Link>
          </p>
        </form>
      </div>

      {showResetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full animate-zoomIn shadow-lg">
            <h3 className="text-lg font-bold mb-2">Reset Password</h3>
            <p className="text-sm text-gray-600 mb-4">Enter your email address and we'll send you a reset link.</p>
            <input
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              placeholder="Your email address"
              className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowResetModal(false);
                  setResetEmail("");
                }}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordReset}
                disabled={isResetPending}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isResetPending ? "Sending..." : "Send Link"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Login;
