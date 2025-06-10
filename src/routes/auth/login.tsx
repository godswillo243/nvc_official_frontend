import { useState, type FormEvent, useEffect } from "react";
import { useLogin, useRequestPasswordReset, useAuthStatus } from "../../lib/react-query/mutations";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

// Helper for password strength (basic example, can be expanded)
const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 1; // Length
    if (/[A-Z]/.test(password)) strength += 1; // Uppercase
    if (/[a-z]/.test(password)) strength += 1; // Lowercase
    if (/[0-9]/.test(password)) strength += 1; // Numbers
    if (/[^A-Za-z0-9]/.test(password)) strength += 1; // Special characters
    return strength; // Returns a score from 0 to 5
};

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
    const [passwordStrength, setPasswordStrength] = useState(0);
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
        if (name === "password") {
            setPasswordStrength(getPasswordStrength(value));
        }
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
                if (newAttempts >= 3) { // After 3 attempts, lockout for 30 seconds
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

    // --- SVG Icons ---
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

    const MailIcon = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
        </svg>
    );

    const LockIcon = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
    );

    const GoogleIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.47 12.23c0-.77-.07-1.52-.2-2.26H12v4.51h6.15c-.26 1.34-1.04 2.47-2.22 3.23v2.94h3.79c2.22-2.04 3.5-5.02 3.5-8.42z" />
            <path fill="#34A853" d="M12 23c3.24 0 5.96-1.07 7.95-2.92l-3.79-2.94c-1.05.7-2.4 1.12-4.16 1.12-3.19 0-5.89-2.16-6.86-5.06H1.36v2.99C3.39 20.87 7.42 23 12 23z" />
            <path fill="#FBBC04" d="M5.14 14.1c-.24-.7-.38-1.44-.38-2.19s.14-1.49.38-2.19V6.82H1.36c-.84 1.68-1.32 3.54-1.32 5.18s.48 3.5 1.32 5.18L5.14 14.1z" />
            <path fill="#EA4335" d="M12 4.12c1.78 0 3.39.73 4.65 1.9L19.4 3.12C17.44 1.25 14.9 0 12 0 7.42 0 3.39 2.13 1.36 5.82L5.14 8.81c.97-2.9 3.67-5.06 6.86-5.06z" />
        </svg>
    );

    const FacebookIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.04C6.465 2.04 2 6.506 2 12.042c0 4.965 3.626 9.096 8.358 9.878V14.67H8.169v-2.628h2.189V10.05c0-2.158 1.282-3.355 3.255-3.355 0.941 0 1.758.07 1.996.101V9.08h-1.282c-1.008 0-1.206.479-1.206 1.18V12.04h2.394l-.312 2.628H13.82V21.92c4.732-.782 8.358-4.913 8.358-9.878C22 6.506 17.535 2.04 12 2.04z" />
        </svg>
    );

    // --- Password Strength Bar Colors & Text ---
    const getStrengthBarColor = (strength: number) => {
        switch (strength) {
            case 0: return 'bg-gray-200';
            case 1: return 'bg-red-500'; // Very weak
            case 2: return 'bg-orange-500'; // Weak
            case 3: return 'bg-yellow-500'; // Moderate
            case 4: return 'bg-blue-500'; // Good
            case 5: return 'bg-green-500'; // Strong
            default: return 'bg-gray-200';
        }
    };

    const getStrengthText = (strength: number) => {
        switch (strength) {
            case 0: return '';
            case 1: return 'Very Weak';
            case 2: return 'Weak';
            case 3: return 'Moderate';
            case 4: return 'Good';
            case 5: return 'Strong';
            default: return '';
        }
    };

    return (
        <>
            {/* Global Styles & Animations: These will apply regardless of where the component is wrapped */}
            {/* Using a <style> tag directly in the component is generally discouraged for larger apps,
                but acceptable for self-contained components like this login form,
                especially when avoiding external CSS-in-JS libraries.
                For production, consider moving these to a global CSS file or a dedicated styling solution.
            */}
            <style>
                {`
                @keyframes backgroundAnimation {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }

                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    50% { transform: translateX(5px); }
                    75% { transform: translateX(-5px); }
                }
                @keyframes zoomIn {
                    0% { transform: scale(0.9); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
                @keyframes fadeIn {
                    0% { opacity: 0; }
                    100% { opacity: 1; }
                }

                .animate-background {
                    background-size: 200% 200%;
                    animation: backgroundAnimation 20s ease infinite;
                }
                .animate-shake {
                    animation: shake 0.3s ease-in-out;
                }
                .animate-zoomIn {
                    animation: zoomIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }

                /* Floating Label Specific Styles */
                /* The label starts inside the input space */
                .input-group .input-label {
                    position: absolute;
                    left: 3rem; /* Adjusted for icon width + padding */
                    top: 50%;
                    transform: translateY(-50%);
                    color: theme('colors.gray.500');
                    transition: all 0.2s ease-in-out;
                    pointer-events: none; /* Allows clicks to pass through to the input */
                    font-size: 1rem; /* Default font size */
                }

                /* When the input group has a value or is focused, move the label up */
                .input-group.has-value .input-label,
                .input-group.is-focused .input-label {
                    top: 0; /* Move to the top */
                    transform: translateY(-0.8rem); /* Adjust vertical position */
                    font-size: 0.75rem; /* Make it smaller */
                    color: theme('colors.blue.600'); /* Change color */
                    background-color: white; /* Match background for clear cut-out effect */
                    padding: 0 0.25rem; /* Add horizontal padding for cut-out */
                    left: 2.75rem; /* Adjust horizontal position after shrinking */
                    z-index: 10; /* Ensure it's above the input border */
                }

                /* Specific adjustment for password eye/clear button interaction */
                .input-group .input-field {
                    padding-right: 3rem; /* Make space for eye/clear button */
                }
                `}
            </style>

            {/* Login Container */}
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 animate-background">
                <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 sm:p-10 transform transition-all duration-500 ease-out animate-fadeIn border border-gray-100 relative overflow-hidden">
                    {/* Subtle top border */}
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-t-3xl"></div>

                    {/* Brand/Logo Placeholder */}
                    <div className="text-center mb-8 pt-4">
                        <img src="https://via.placeholder.com/60x60.png?text=LOGO" alt="Company Logo" className="mx-auto h-16 w-16 mb-4 rounded-full shadow-inner" />
                        <h1 className="text-4xl font-extrabold text-gray-800 leading-tight">MyApp Name</h1>
                    </div>

                    <h2 className="text-3xl font-bold text-center text-gray-700 mb-8">Sign In</h2>
                    {/* Social Login Options */}
                    <div className="flex flex-col space-y-3 mb-6">
                        <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-200 text-base font-medium">
                            <GoogleIcon />
                            <span className="ml-3">Sign in with Google</span>
                        </button>
                        <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-200 text-base font-medium">
                            <FacebookIcon />
                            <span className="ml-3">Sign in with Facebook</span>
                        </button>
                    </div>

                    <div className="relative flex py-5 items-center">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="flex-shrink mx-4 text-gray-500 text-sm">Or continue with</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Input with Floating Label and Icon */}
                        <div className={`input-group relative ${form.email ? 'has-value' : ''}`}>
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                                <MailIcon />
                            </div>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                onChange={handleChange}
                                value={form.email}
                                className={`input-field mt-1 block w-full pl-12 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 text-base placeholder-gray-400 ${
                                    formErrors.email ? "border-red-500 animate-shake" : "border-gray-300 focus:border-blue-500"
                                }`}
                                disabled={isLockedOut}
                                onFocus={(e) => e.currentTarget.parentNode?.classList.add('is-focused')}
                                onBlur={(e) => {
                                    if (!e.currentTarget.value) e.currentTarget.parentNode?.classList.remove('is-focused');
                                    else e.currentTarget.parentNode?.classList.add('has-value'); // Re-add has-value if content exists
                                }}
                            />
                            <label htmlFor="email" className="input-label">Email Address</label>
                            {/* Clear Button for Email */}
                            {form.email && (
                                <button
                                    type="button"
                                    onClick={() => setForm(prev => ({ ...prev, email: "" }))}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 z-10"
                                    aria-label="Clear email"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </button>
                            )}
                            {formErrors.email && (
                                <p className="text-sm text-red-600 mt-2 font-medium flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
                                    {formErrors.email}
                                </p>
                            )}
                        </div>

                        {/* Password Input with Floating Label, Icon, and Strength Indicator */}
                        <div className={`input-group relative ${form.password ? 'has-value' : ''}`}>
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                                <LockIcon />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                minLength={8}
                                required
                                onChange={handleChange}
                                value={form.password}
                                className={`input-field mt-1 block w-full pl-12 pr-12 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 text-base placeholder-gray-400 ${
                                    formErrors.password ? "border-red-500 animate-shake" : "border-gray-300 focus:border-blue-500"
                                }`}
                                disabled={isLockedOut}
                                onFocus={(e) => e.currentTarget.parentNode?.classList.add('is-focused')}
                                onBlur={(e) => {
                                    if (!e.currentTarget.value) e.currentTarget.parentNode?.classList.remove('is-focused');
                                    else e.currentTarget.parentNode?.classList.add('has-value'); // Re-add has-value if content exists
                                }}
                            />
                            <label htmlFor="password" className="input-label">Password</label>
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 top-1/2 -translate-y-1/2 pr-4 flex items-center text-gray-500 hover:text-gray-700 transition-colors duration-200 z-10"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                            </button>
                            {formErrors.password && (
                                <p className="text-sm text-red-600 mt-2 font-medium flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
                                    {formErrors.password}
                                </p>
                            )}

                            {/* Password Strength Indicator */}
                            {form.password.length > 0 && ( // Show only if password is being typed
                                <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                                    <div
                                        className={`h-1 rounded-full ${getStrengthBarColor(passwordStrength)} transition-all duration-300`}
                                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                                    ></div>
                                    {passwordStrength > 0 && ( // Only show text if strength is not zero
                                        <span className={`text-xs font-medium ${getStrengthBarColor(passwordStrength).replace('bg', 'text')} ml-1`}>
                                            {getStrengthText(passwordStrength)}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-gray-900 cursor-pointer">
                                    Remember me
                                </label>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowResetModal(true)}
                                className="font-medium text-blue-600 hover:text-blue-700 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-200 rounded-md px-2 py-1 -mr-2 transition-colors duration-200"
                            >
                                Forgot password?
                            </button>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={isPending || isLockedOut}
                            className={`w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 text-lg ${
                                isPending || isLockedOut ? "opacity-60 cursor-not-allowed" : ""
                            }`}
                        >
                            {isPending ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Logging in...
                                </span>
                            ) : isLockedOut ? (
                                `Try again in ${lockoutTimer}s`
                            ) : (
                                "Login"
                            )}
                        </button>

                        {/* Sign Up Link */}
                        <p className="text-center text-sm text-gray-600 mt-6">
                            Don’t have an account?{" "}
                            <Link to="/auth/signup" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline">Sign up</Link>
                        </p>
                    </form>
                </div>
            </div>

            {/* Password Reset Modal */}
            {showResetModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fadeIn p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-sm w-full animate-zoomIn shadow-2xl">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Reset Password</h3>
                        <p className="text-sm text-gray-600 mb-6 text-center">Enter your email address and we'll send you a link to reset your password.</p>
                        <input
                            type="email"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            placeholder="your@example.com"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-blue-200 text-base placeholder-gray-400"
                        />
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => {
                                    setShowResetModal(false);
                                    setResetEmail("");
                                }}
                                className="px-5 py-2 text-base font-medium text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePasswordReset}
                                disabled={isResetPending}
                                className={`px-6 py-2 bg-blue-600 text-white text-base font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-md ${
                                    isResetPending ? "flex items-center justify-center" : ""
                                }`}
                            >
                                {isResetPending ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending...
                                    </span>
                                ) : (
                                    "Send Link"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Login;
