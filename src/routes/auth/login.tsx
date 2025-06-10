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
    // Removed: const [rememberMe, setRememberMe] = useState(false); // No longer needed for login logic

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

        // Changed: Removed rememberMe from the payload sent to login
        login(form, { //  This now matches the "working" version's call
            onSuccess: () => {
                toast.success("Login successful!");
                setLoginAttempts(0);
            },
            onError: (error: any) => { // Added ': any' for demonstration, but safer to type narrow as discussed
                const newAttempts = loginAttempts + 1;
                setLoginAttempts(newAttempts); // 
                if (newAttempts >= 3) {
                    setIsLockedOut(true);
                    setLockoutTimer(30);
                    toast.error("Too many attempts. Please try again in 30 seconds."); // 
                    return;
                }
                toast.error(
                    error.status === 401 //  (Assuming your `error` object truly has `status`)
                        ? `Invalid email or password (${newAttempts}/3 attempts)` // 
                        : error.message || "Login failed. Please try again." //  (Assuming your `error` object truly has `message`)
                );
            },
        });
    }

    function handlePasswordReset() {
        if (!resetEmail) {
            toast.error("Please enter your email address"); // 
            return; // 
        }
        if (!/\S+@\S+\.\S+/.test(resetEmail)) {
            toast.error("Please enter a valid email address"); // 
            return; // 
        }
        requestReset(resetEmail, {
            onSuccess: () => {
                toast.success("Password reset link sent to your email");
                setShowResetModal(false);
                setResetEmail("");
            },
            onError: (error: any) => { // Added ': any' for demonstration
                toast.error(error.message || "Failed to send reset link"); // 
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
        <>
            {/* Global Styles & Animations: These will apply regardless of where the component is wrapped */}
            <style>
                {`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); } // 
                    25% { transform: translateX(-5px); } // 
                    50% { transform: translateX(5px); } // 
                    75% { transform: translateX(-5px); } // 
                }
                @keyframes zoomIn { // 
                    0% { transform: scale(0.9); opacity: 0; } // 
                    100% { transform: scale(1); opacity: 1; } // 
                }
                @keyframes fadeIn { // 
                    0% { opacity: 0; } // 
                    100% { opacity: 1; } // 
                }

                .animate-shake {
                    animation: shake 0.3s ease-in-out; // 
                }
                .animate-zoomIn {
                    animation: zoomIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); /* More playful zoom */ // 
                }
                .animate-fadeIn { // 
                    animation: fadeIn 0.3s ease-out; // 
                }
                `}
            </style>

            {/* Login Container: Centralized and styled for modern appeal */}
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6">
                <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 sm:p-10 transform transition-all duration-500 ease-out animate-fadeIn border border-gray-100"> {/*  */}
                    <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-2 mt-4 leading-tight">Welcome Back</h2>
                    <p className="text-center text-gray-500 mb-8">Sign in to continue to your account.</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Input */} {/*  */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                            <input
                                [cite_start]type="email" // [cite: 40]
                                id="email"
                                name="email"
                                [cite_start]required // [cite: 41]
                                onChange={handleChange}
                                value={form.email}
                                [cite_start]className={`mt-1 block w-full px-5 py-3 border ${ // [cite: 42]
                                    formErrors.email ?
                                        [cite_start]"border-red-500 animate-shake" : "border-gray-300 focus:border-blue-500" // [cite: 43]
                                } rounded-xl shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 text-base placeholder-gray-400`}
                                disabled={isLockedOut}
                                [cite_start]placeholder="name@example.com" // [cite: 44]
                            />
                            {formErrors.email && <p className="text-sm text-red-600 mt-2 font-medium">{formErrors.email}</p>}
                        </div>

                        {/* Password Input */} {/*  */}
                        <div className="relative">
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                            <input
                                type={showPassword ?
                                    [cite_start]"text" : "password"} // [cite: 47]
                                id="password"
                                name="password"
                                minLength={8}
                                [cite_start]required // [cite: 48]
                                onChange={handleChange}
                                value={form.password}
                                [cite_start]className={`mt-1 block w-full px-5 py-3 pr-12 border ${ // [cite: 49]
                                    formErrors.password ?
                                        [cite_start]"border-red-500 animate-shake" : "border-gray-300 focus:border-blue-500" // [cite: 50]
                                } rounded-xl shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 text-base placeholder-gray-400`}
                                placeholder="Minimum 8 characters"
                                [cite_start]disabled={isLockedOut} // [cite: 51]
                            />
                            <button
                                type="button"
                                [cite_start]onClick={() => setShowPassword(!showPassword)} // 
                                className="absolute inset-y-0 right-0 top-7 pr-4 flex items-center text-gray-500 hover:text-gray-700 transition-colors duration-200"
                                aria-label={showPassword ? "Hide password" : "Show password"} // 
                            >
                                {showPassword ?
                                    <EyeOffIcon /> : <EyeIcon />} {/*  */}
                            </button>
                            {formErrors.password && <p className="text-sm text-red-600 mt-2 font-medium">{formErrors.password}</p>}
                        </div>

                        {/* Forgot Password Link */} {/*  */}
                        <div className="text-right">
                            <button
                                [cite_start]type="button" // [cite: 56]
                                onClick={() => setShowResetModal(true)}
                                className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-200 rounded-md px-2 py-1 -mr-2 transition-colors duration-200"
                            >
                                Forgot password? {/*  */}
                            </button>
                        </div>

                        {/* Remember Me Checkbox (UI Only - No Logic) */}
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                checked={false} // Fixed to false as it's not functional
                                onChange={() => { /* No-op: do nothing as rememberMe logic is removed */ }}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                disabled={isLockedOut} // Inherit disabled state for consistency
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                Remember me
                            </label>
                        </div>

                        {/* Login Button */}
                        <button
                            [cite_start]type="submit" // [cite: 59]
                            [cite_start]disabled={isPending || isLockedOut} // [cite: 60]
                            className={`w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 text-lg
                            ${isPending || isLockedOut ? [cite_start]"opacity-60 cursor-not-allowed" : ""}`} // [cite: 61]
                        >
                            {isPending ?
                                "Logging in..." : isLockedOut ? `Try again in ${lockoutTimer}s` : "Login"} {/*  */}
                        </button>

                        {/* Sign Up Link */}
                        <p className="text-center text-sm text-gray-600 mt-6">
                            Don’t have an account?{" "} {/*  */}
                            <Link to="/auth/signup" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline">Sign up</Link>
                        </p>
                    </form> {/*  */}
                </div>
            </div>

            {/* Password Reset Modal */}
            {showResetModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fadeIn p-4"> {/*  */}
                    <div className="bg-white rounded-2xl p-8 max-w-sm w-full animate-zoomIn shadow-2xl"> {/*  */}
                        <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Reset Password</h3>
                        <p className="text-sm text-gray-600 mb-6 text-center">Enter your email address and we'll send you a link to reset your password.</p>
                        <input
                            [cite_start]type="email" // [cite: 66]
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            placeholder="your@example.com" // 
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-blue-200 text-base placeholder-gray-400"
                        />
                        <div className="flex justify-end space-x-4"> {/*  */}
                            <button
                                onClick={() => {
                                    setShowResetModal(false); // 
                                    setResetEmail(""); // 
                                }}
                                className="px-5 py-2 text-base font-medium text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
                            >
                                Cancel {/*  */}
                            </button>
                            <button
                                onClick={handlePasswordReset}
                                [cite_start]disabled={isResetPending} // [cite: 72]
                                className="px-6 py-2 bg-blue-600 text-white text-base font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-md"
                            >
                                {isResetPending ?
                                    "Sending..." : "Send Link"} {/*  */}
                            </button>
                        </div>
                    </div>
                </div>
            )} {/*  */}
        </>
    );
}

export default Login;
