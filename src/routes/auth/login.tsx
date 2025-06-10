import { useState, type FormEvent, useEffect } from "react";
import { useLogin, useRequestPasswordReset, useAuthStatus } from "../../lib/react-query/mutations";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

// Helper for password strength (basic example)
const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength; // 0-5
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
    const [rememberMe, setRememberMe] = useState(false); // New state for "Remember Me"

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

    // SVG Icons for visual flair
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
        <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.47 12.23c0-.77-.07-1.52-.2-2.26H12v4.51h6.15c-.26 1.34-1.04 2.47-2.22 3.23v2.94h3.79c2.22-2.04 3.5-5.02 3.5-8.42z" />
            <path fill="#34A853" d="M12 23c3.24 0 5.96-1.07 7.95-2.92l-3.79-2.94c-1.05.7-2.4 1.12-4.16 1.12-3.19 0-5.89-2.16-6.86-5.06H1.36v2.99C3.39 20.87 7.42 23 12 23z" />
            <path fill="#FBBC04" d="M5.14 14.1c-.24-.7-.38-1.44-.38-2.19s.14-1.49.38-2.19V6.82H1.36c-.84 1.68-1.32 3.54-1.32 5.18s.48 3.5 1.32 5.18L5.14 14.1z" />
            <path fill="#EA4335" d="M12 4.12c1.78 0 3.39.73 4.65 1.9L19.4 3.12C17.44 1.25 14.9 0 12 0 7.42 0 3.39 2.13 1.36 5.82L5.
