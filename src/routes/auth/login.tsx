import { useState, type FormEvent, useEffect, FC, Dispatch, SetStateAction } from "react";
import { useLogin, useRequestPasswordReset, useAuthStatus } from "../../lib/react-query/mutations";
import { Link, useNavigate } from "react-router-dom";

// --- Sub-Components (Defined within Login.tsx for encapsulation) ---

// 1. Icon Components
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

const SpinnerIcon = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

// 2. Alert Message Component (replaces toast)
type AlertMessageProps = {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
};
const AlertMessage: FC<AlertMessageProps> = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000); // Auto-dismiss after 5 seconds
        return () => clearTimeout(timer);
    }, [onClose]);

    const baseClasses = "px-4 py-3 rounded-lg relative text-center mb-6 animate-fadeIn";
    const typeClasses = {
        success: "bg-green-100 border border-green-400 text-green-700",
        error: "bg-red-100 border border-red-400 text-red-700",
    };

    if (!message) return null;

    return (
        <div className={`${baseClasses} ${typeClasses[type]}`} role="alert">
            <span className="block sm:inline">{message}</span>
            <button onClick={onClose} className="absolute top-0 bottom-0 right-0 px-4 py-3">
                <svg className="fill-current h-6 w-6" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
            </button>
        </div>
    );
};


// 3. Password Reset Modal Component
type PasswordResetModalProps = {
    isOpen: boolean;
    onClose: () => void;
    requestReset: (email: string, options: any) => void;
    isResetPending: boolean;
};
const PasswordResetModal: FC<PasswordResetModalProps> = ({ isOpen, onClose, requestReset, isResetPending }) => {
    const [resetEmail, setResetEmail] = useState("");
    const [emailError, setEmailError] = useState("");

    const handleReset = () => {
        if (!resetEmail) {
            setEmailError("Please enter your email address");
            return;
        }
        if (!/\S+@\S+\.\S+/.test(resetEmail)) {
            setEmailError("Please enter a valid email address");
            return;
        }
        setEmailError("");
        requestReset(resetEmail, {
            onSuccess: () => {
                // Success feedback is now handled by the parent component
                onClose();
            },
        });
    };

    const handleClose = () => {
        setResetEmail("");
        setEmailError("");
        onClose();
    };
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fadeIn p-4">
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full animate-zoomIn shadow-2xl">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Reset Password</h3>
                <p className="text-sm text-gray-600 mb-6 text-center">Enter your email address and we'll send you a link to reset your password.</p>
                <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="your@example.com"
                    className={`w-full px-4 py-3 border rounded-xl mb-2 focus:outline-none focus:ring-2 text-base placeholder-gray-400 ${
                        emailError ? 'border-red-500 ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                    }`}
                />
                {emailError && <p className="text-sm text-red-600 mb-4 font-medium">{emailError}</p>}
                
                <div className="flex justify-end space-x-4 mt-4">
                    <button onClick={handleClose} className="px-5 py-2 text-base font-medium text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">Cancel</button>
                    <button onClick={handleReset} disabled={isResetPending} className="px-6 py-2 bg-blue-600 text-white text-base font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-md">
                        {isResetPending ? "Sending..." : "Send Link"}
                    </button>
                </div>
            </div>
        </div>
    );
};

// 4. Presentation Form Component
type LoginFormProps = {
    onLogin: (data: { email: string; password: string }) => void;
    isPending: boolean;
    onForgotPassword: () => void;
    serverMessage: { type: 'success' | 'error', text: string } | null;
};
const LoginForm: FC<LoginFormProps> = ({ onLogin, isPending, onForgotPassword, serverMessage }) => {
    const [form, setForm] = useState({ email: "", password: "" });
    const [formErrors, setFormErrors] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);

    const validateField = (name: 'email' | 'password', value: string) => {
        let error = "";
        if (name === 'email') {
            if (!value) error = "Email is required";
            else if (!/\S+@\S+\.\S+/.test(value)) error = "Email is invalid";
        }
        if (name === 'password') {
            if (!value) error = "Password is required";
            else if (value.length < 8) error = "Password must be at least 8 characters";
        }
        setFormErrors((prev) => ({ ...prev, [name]: error }));
        return !error;
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target as { name: 'email' | 'password'; value: string };
        validateField(name, value);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target as { name: 'email' | 'password'; value: string };
        setForm((prev) => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const isEmailValid = validateField('email', form.email);
        const isPasswordValid = validateField('password', form.password);
        if (isEmailValid && isPasswordValid) {
            onLogin(form);
        }
    };

    return (
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 sm:p-10 transform transition-all duration-500 ease-out animate-fadeIn border border-gray-100">
            <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-2 mt-4 leading-tight">Welcome Back</h2>
            <p className="text-center text-gray-500 mb-8">Sign in to continue to your account.</p>

            {serverMessage && serverMessage.type === 'error' && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md" role="alert">
                    <p>{serverMessage.text}</p>
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <input
                        type="email" id="email" name="email" required
                        onChange={handleChange} onBlur={handleBlur} value={form.email}
                        className={`mt-1 block w-full px-5 py-3 border ${formErrors.email ? "border-red-500 animate-shake" : "border-gray-300 focus:border-blue-500"} rounded-xl shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200`}
                        disabled={isPending} placeholder="name@example.com"
                    />
                    {formErrors.email && <p className="text-sm text-red-600 mt-2 font-medium">{formErrors.email}</p>}
                </div>

                <div className="relative">
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                    <input
                        type={showPassword ? "text" : "password"} id="password" name="password" minLength={8} required
                        onChange={handleChange} onBlur={handleBlur} value={form.password}
                        className={`mt-1 block w-full px-5 py-3 pr-12 border ${formErrors.password ? "border-red-500 animate-shake" : "border-gray-300 focus:border-blue-500"} rounded-xl shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200`}
                        placeholder="Minimum 8 characters" disabled={isPending}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 top-7 pr-4 flex items-center text-gray-500 hover:text-gray-700" aria-label={showPassword ? "Hide password" : "Show password"}>
                        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                    {formErrors.password && <p className="text-sm text-red-600 mt-2 font-medium">{formErrors.password}</p>}
                </div>

                <div className="text-right">
                    <button type="button" onClick={onForgotPassword} className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-200 rounded-md px-2 py-1 -mr-2">
                        Forgot password?
                    </button>
                </div>

                <button type="submit" disabled={isPending} className="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 text-lg flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed">
                    {isPending ? <SpinnerIcon /> : null}
                    {isPending ? "Logging in..." : "Login"}
                </button>

                <p className="text-center text-sm text-gray-600 mt-6">
                    Don’t have an account?{" "}
                    <Link to="/auth/signup" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline">Sign up</Link>
                </p>
            </form>
        </div>
    );
};


// --- Main Page Component ---
function Login() {
    const navigate = useNavigate();
    const { mutate: login, isPending: isLoginPending } = useLogin();
    const { mutate: requestReset, isPending: isResetPending } = useRequestPasswordReset();
    const { isAuthenticated } = useAuthStatus();

    const [loginAttempts, setLoginAttempts] = useState(0);
    const [isLockedOut, setIsLockedOut] = useState(false);
    const [lockoutTimer, setLockoutTimer] = useState(0);
    const [showResetModal, setShowResetModal] = useState(false);
    
    // State to manage all user feedback messages
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) navigate("/dashboard");
    }, [isAuthenticated, navigate]);

    // Lockout timer logic
    useEffect(() => {
        if (!isLockedOut) return;
        const timer = setInterval(() => {
            setLockoutTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setIsLockedOut(false);
                    setLoginAttempts(0);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [isLockedOut]);

    const handleLogin = (formData: { email: string, password: string }) => {
        setMessage(null); // Clear previous messages
        if (isLockedOut) {
            setMessage({ type: 'error', text: `Too many attempts. Please try again in ${lockoutTimer} seconds.` });
            return;
        }

        login(formData, {
            onSuccess: () => {
                setMessage({ type: 'success', text: 'Login successful! Redirecting...' });
                setLoginAttempts(0);
                // navigate will be triggered by isAuthenticated effect
            },
            onError: (error: any) => {
                const newAttempts = loginAttempts + 1;
                setLoginAttempts(newAttempts);
                if (newAttempts >= 5) {
                    setIsLockedOut(true);
                    setLockoutTimer(60);
                    setMessage({ type: 'error', text: "Too many attempts. Account locked for 60 seconds." });
                } else {
                    const errorMsg = error.status === 401
                        ? `Invalid credentials. (${newAttempts}/5 attempts)`
                        : error.message || "Login failed. Please try again.";
                    setMessage({ type: 'error', text: errorMsg });
                }
            },
        });
    };
    
    const handleRequestReset = (email: string, options: any) => {
        setMessage(null);
        requestReset(email, {
            ...options,
            onSuccess: () => {
                options.onSuccess();
                setMessage({type: 'success', text: 'Password reset link sent to your email.'});
            },
            onError: (error: any) => {
                setMessage({type: 'error', text: error.message || "Failed to send reset link."});
            },
        });
    };

    const isPending = isLoginPending || isLockedOut;

    return (
        <>
            <style>
                {`
                @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 50% { transform: translateX(5px); } 75% { transform: translateX(-5px); } }
                @keyframes zoomIn { 0% { transform: scale(0.9); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
                @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
                .animate-shake { animation: shake 0.3s ease-in-out; }
                .animate-zoomIn { animation: zoomIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
                .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
                `}
            </style>

            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 relative">
                 <div className="absolute top-5 w-full max-w-md px-4">
                    {message && <AlertMessage message={message.text} type={message.type} onClose={() => setMessage(null)} />}
                </div>
                
                <LoginForm 
                    onLogin={handleLogin}
                    isPending={isPending}
                    onForgotPassword={() => setShowResetModal(true)}
                    serverMessage={message && isLoginPending ? null : message} // Pass server message but hide it during new login attempts
                />
            </div>
            
            <PasswordResetModal
                isOpen={showResetModal}
                onClose={() => setShowResetModal(false)}
                requestReset={handleRequestReset}
                isResetPending={isResetPending}
            />
        </>
    );
}

export default Login;
