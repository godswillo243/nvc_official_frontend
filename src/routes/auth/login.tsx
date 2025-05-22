import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginRoute() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Initialize MDC text fields when component mounts
  useEffect(() => {
    if (window.mdc) {
      const MDCTextField = window.mdc.textField.MDCTextField;
      document.querySelectorAll('.mdc-text-field').forEach((el) => new MDCTextField(el));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, password });
    // Add your auth logic here
    navigate('/dashboard');
  };

  return (
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
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Welcome Back</h2>

        {/* Email */}
        <label className="mdc-text-field mdc-text-field--filled" style={{ width: '100%', marginBottom: '1.5rem' }}>
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
        <label className="mdc-text-field mdc-text-field--filled mdc-text-field--with-leading-icon" style={{ width: '100%', marginBottom: '0.5rem' }}>
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
        <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
          <Link to="/forgot-password" style={{ color: '#6200ee', textDecoration: 'none' }}>
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          className="mdc-button mdc-button--raised"
          style={{ width: '100%', padding: '0.75rem', fontSize: '1rem' }}
        >
          Log In
        </button>

        {/* Sign up */}
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
          Don’t have an account?{' '}
          <Link to="/signup" style={{ color: '#6200ee', textDecoration: 'none' }}>
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
