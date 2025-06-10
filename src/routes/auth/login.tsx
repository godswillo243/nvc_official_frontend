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
    const [rememberMe, setRememberMe] = useState(false);

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
        login({ ...form, rememberMe }, {
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

    // SVG Icons as components
    const EyeIcon = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
        </svg>
    );

    const EyeOffIcon = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
        </svg>
    );

    const GoogleIcon = () => (
        <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
    );

    const FacebookIcon = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
            <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
        </svg>
    );

    const GitHubIcon = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
        </svg>
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
            {/* Login Card */}
            <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
                {/* Decorative Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-6 px-8">
                    <h2 className="text-2xl font-bold text-white text-center">Welcome Back</h2>
                    <p className="text-blue-200 text-center mt-2">Sign in to access your account</p>
                </div>
                
                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                onChange={handleChange}
                                value={form.email}
                                className={`w-full px-4 py-3 border rounded-lg transition-colors ${
                                    formErrors.email 
                                        ? "border-red-500 bg-red-50 animate-shake" 
                                        : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                }`}
                                disabled={isLockedOut}
                                placeholder="name@company.com"
                            />
                            {formErrors.email && <p className="text-sm text-red-600 mt-1">{formErrors.email}</p>}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                <button
                                    type="button"
                                    onClick={() => setShowResetModal(true)}
                                    className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                                >
                                    Forgot password?
                                </button>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    minLength={8}
                                    required
                                    onChange={handleChange}
                                    value={form.password}
                                    className={`w-full px-4 py-3 pr-12 border rounded-lg transition-colors ${
                                        formErrors.password 
                                            ? "border-red-500 bg-red-50 animate-shake" 
                                            : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    }`}
                                    placeholder="••••••••"
                                    disabled={isLockedOut}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                </button>
                            </div>
                            {formErrors.password && <p className="text-sm text-red-600 mt-1">{formErrors.password}</p>}
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                Remember me
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isPending || isLockedOut}
                            className={`w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                isPending || isLockedOut ? "opacity-70 cursor-not-allowed" : ""
                            }`}
                        >
                            {isPending ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : isLockedOut ? (
                                `Try again in ${lockoutTimer}s`
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="mt-6 relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    {/* Social Login */}
                    <div className="mt-6 grid grid-cols-3 gap-3">
                        <button
                            type="button"
                            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <GoogleIcon />
                            <span className="ml-2">Google</span>
                        </button>
                        <button
                            type="button"
                            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <FacebookIcon />
                            <span className="ml-2">Facebook</span>
                        </button>
                        <button
                            type="button"
                            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <GitHubIcon />
                            <span className="ml-2">GitHub</span>
                        </button>
                    </div>

                    {/* Sign Up Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{" "}
                            <Link to="/auth/signup" className="font-medium text-blue-600 hover:text-blue-800 transition-colors">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Password Reset Modal */}
            {showResetModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-5 px-6">
                            <h3 className="text-xl font-bold text-white">Reset Password</h3>
                        </div>
                        
                        <div className="p-6">
                            <p className="text-gray-600 mb-4">
                                Enter your email address and we'll send you a link to reset your password.
                            </p>
                            <input
                                type="email"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                placeholder="your@email.com"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                            />
                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    onClick={() => {
                                        setShowResetModal(false);
                                        setResetEmail("");
                                    }}
                                    className="px-5 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handlePasswordReset}
                                    disabled={isResetPending}
                                    className="px-6 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-70 transition-colors"
                                >
                                    {isResetPending ? "Sending..." : "Send Link"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Global Styles */}
            <style>
                {`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    50% { transform: translateX(5px); }
                    75% { transform: translateX(-5px); }
                }
                .animate-shake {
                    animation: shake 0.3s ease-in-out;
                }
                `}
            </style>
        </div>
    );
}

export default Login;
