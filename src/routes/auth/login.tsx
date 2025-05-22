import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Dynamically load MDC CSS, icons font, and JS
  useEffect(() => {
    // Load MDC CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css';
    document.head.appendChild(link);

    // Load Material Icons font
    const icons = document.createElement('link');
    icons.rel = 'stylesheet';
    icons.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
    document.head.appendChild(icons);

    // Load MDC JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/material-components-web@latest/dist/material-components-web.min.js';
    script.onload = () => {
      if (window.mdc) {
        const MDCTextField = window.mdc.textField.MDCTextField;
        document.querySelectorAll('.mdc-text-field').forEach((el) => new MDCTextField(el));
      }
    };
    document.body.appendChild(script);

    // Cleanup on unmount
    return () => {
      document.head.removeChild(link);
      document.head.removeChild(icons);
      document.body.removeChild(script);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://nvc-api.onrender.com/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const err = await response.json();
        alert(err.detail || 'Login failed');
        return;
      }

      const data = await response.json();
      localStorage.setItem('token', data.token || 'dummy-token');
      navigate('/dashboard');
    } catch (error) {
      alert('Network error or server not reachable');
      console.error(error);
    }
  };

  // Animation timings: stagger each item by 300ms
  const baseDelay = 300;

  return (
    <>
      {/* Inject keyframe styles */}
      <style>{`
        @keyframes slideInBounce {
          0% {
            transform: translateX(100%);
            opacity: 0;
          }
          60% {
            transform: translateX(-10%);
            opacity: 1;
          }
          80% {
            transform: translateX(5%);
          }
          100% {
            transform: translateX(0);
          }
        }
        @keyframes bounceOnce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animated-slide-bounce {
          animation-fill-mode: forwards;
          animation-timing-function: cubic-bezier(0.68, -0.55, 0.27, 1.55);
        }
      `}</style>

      <div
        style={{
          display: 'flex',
          height: '100vh',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f5f5f5',
          fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            width: '360px',
          }}
        >
          <h2
            style={{
              textAlign: 'center',
              marginBottom: '1.5rem',
              opacity: 0,
              animation: `slideInBounce 600ms ease forwards, bounceOnce 1s ease 600ms forwards`,
              animationDelay: `0ms, 600ms`,
            }}
          >
            Welcome Back
          </h2>

          {/* Email */}
          <label
            className="mdc-text-field mdc-text-field--filled"
            style={{
              width: '100%',
              marginBottom: '1.5rem',
              opacity: 0,
              animation: `slideInBounce 600ms ease forwards, bounceOnce 1s ease 600ms forwards`,
              animationDelay: `${baseDelay}ms, ${baseDelay + 600}ms`,
              display: 'block',
            }}
          >
            <span className="mdc-text-field__ripple"></span>
            <input
              className="mdc-text-field__input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              id="email"
            />
            <span className="mdc-floating-label" htmlFor="email">
              Email
            </span>
            <span className="mdc-line-ripple"></span>
          </label>

          {/* Password */}
          <label
            className="mdc-text-field mdc-text-field--filled mdc-text-field--with-leading-icon"
            style={{
              width: '100%',
              marginBottom: '0.5rem',
              opacity: 0,
              animation: `slideInBounce 600ms ease forwards, bounceOnce 1s ease 600ms forwards`,
              animationDelay: `${baseDelay * 2}ms, ${baseDelay * 2 + 600}ms`,
              display: 'block',
            }}
          >
            <i className="material-icons mdc-text-field__icon" tabIndex="0" role="button">
              lock
            </i>
            <input
              className="mdc-text-field__input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              id="password"
            />
            <span className="mdc-floating-label" htmlFor="password">
              Password
            </span>
            <span className="mdc-line-ripple"></span>
          </label>

          {/* Forgot password */}
          <div
            style={{
              textAlign: 'right',
              marginBottom: '1.5rem',
              opacity: 0,
              animation: `slideInBounce 600ms ease forwards, bounceOnce 1s ease 600ms forwards`,
              animationDelay: `${baseDelay * 3}ms, ${baseDelay * 3 + 600}ms`,
            }}
          >
            <Link to="/forgot-password" style={{ color: '#6200ee', textDecoration: 'none' }}>
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="mdc-button mdc-button--raised"
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '1rem',
              opacity: 0,
              animation: `slideInBounce 600ms ease forwards, bounceOnce 1s ease 600ms forwards`,
              animationDelay: `${baseDelay * 4}ms, ${baseDelay * 4 + 600}ms`,
            }}
          >
            Log In
          </button>

          {/* Sign up */}
          <p
            style={{
              textAlign: 'center',
              marginTop: '1.5rem',
              fontSize: '0.9rem',
              opacity: 0,
              animation: `slideInBounce 600ms ease forwards, bounceOnce 1s ease 600ms forwards`,
              animationDelay: `${baseDelay * 5}ms, ${baseDelay * 5 + 600}ms`,
            }}
          >
            Don’t have an account?{' '}
            <Link to="/signup" style={{ color: '#6200ee', textDecoration: 'none' }}>
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}
