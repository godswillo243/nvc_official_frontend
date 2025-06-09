import { useState, type FormEvent, useEffect } from "react";
import { useSignup } from "../../lib/react-query/mutations";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail, validatePhoneNumber, validatePassword } from "../../utils/validators";

function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    nin: "",
    phone_number: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  const { mutate: signup, isPending } = useSignup();
  const navigate = useNavigate();

  useEffect(() => {
    // Validate form on change
    const errors: Record<string, string> = {};

    if (touchedFields.name && !form.name.trim()) {
      errors.name = "Full name is required";
    }

    if (touchedFields.email) {
      if (!form.email) {
        errors.email = "Email is required";
      } else if (!validateEmail(form.email)) {
        errors.email = "Please enter a valid email address";
      }
    }

    if (touchedFields.phone_number) {
      if (!form.phone_number) {
        errors.phone_number = "Phone number is required";
      } else if (!validatePhoneNumber(form.phone_number)) {
        errors.phone_number = "Please enter a valid phone number";
      }
    }

    if (touchedFields.nin && form.nin && form.nin.length !== 11) {
      errors.nin = "NIN must be exactly 11 digits";
    }

    if (touchedFields.password) {
      if (!form.password) {
        errors.password = "Password is required";
      } else if (!validatePassword(form.password)) {
        errors.password = "Password must be at least 8 characters";
      }
    }

    if (touchedFields.confirmPassword && form.password !== form.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFormErrors(errors);
  }, [form, touchedFields]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    const { name } = e.target;
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Mark all fields as touched to show all possible errors
    setTouchedFields({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      phone_number: true,
      nin: true,
    });

    // Check if there are any errors
    if (Object.keys(formErrors).length > 0) {
      toast.error("Please fix the errors in the form");
      return;
    }

    const { name, email, password, phone_number, nin } = form;

    const payload = {
      name: name.trim(),
      email: email.trim(),
      password,
      phone_number: phone_number.trim(),
      nin: nin.trim() || "***********", // Default value if not provided
    };

    signup(payload, {
      onError(error: any) {
        toast.error(
          error?.response?.data?.message || 
          error?.message || 
          "Signup failed. Please try again."
        );
      },
      onSuccess() {
        toast.success("Account created successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/auth/login");
        }, 1500);
      },
    });
  }

  return (
    <div className="form-container max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
      <form id="registrationForm" onSubmit={handleSubmit} noValidate>
        {[
          { id: "name", label: "Full Name", type: "text", required: true },
          { id: "email", label: "Email Address", type: "email", required: true },
          { id: "phone_number", label: "Phone Number", type: "tel", required: true },
          { id: "nin", label: "Nigerian NIN (optional)", type: "text", placeholder: "11-digit NIN", pattern: "\\d*" },
          { id: "password", label: "Password", type: "password", required: true, minLength: 8, placeholder: "At least 8 characters" },
          { id: "confirmPassword", label: "Confirm Password", type: "password", required: true },
        ].map((field) => (
          <div key={field.id} className="form-group mb-4">
            <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              id={field.id}
              name={field.id}
              type={field.type}
              required={field.required}
              minLength={field.minLength}
              placeholder={field.placeholder}
              pattern={field.pattern}
              onChange={handleChange}
              onBlur={handleBlur}
              value={form[field.id as keyof typeof form]}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                formErrors[field.id] ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200"
              }`}
            />
            {formErrors[field.id] && (
              <p className="mt-1 text-sm text-red-600">{formErrors[field.id]}</p>
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={isPending || Object.keys(formErrors).length > 0}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            isPending || Object.keys(formErrors).length > 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isPending ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Account...
            </span>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      <p className="text-center mt-4 text-gray-600">
        Already have an account?{" "}
        <Link
          to="/auth/login"
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Login
        </Link>
      </p>
    </div>
  );
}

export default Signup;
