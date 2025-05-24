import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext'; // Adjust path if needed

export default function LoginRoute() {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [buttonShift, setButtonShift] = useState<'left' | 'right' | null>(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes slideIn {
        0% { opacity: 0; transform: translateX(-50px); }
        100% { opacity: 1; transform: translateX(0); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const slideIn = (delay: number) => ({
    animation: `slideIn 0.5s ease forwards`,
    animationDelay: `${delay}s`,
    opacity: 0,
  });

  const handleLogin = async () => {
    setButtonShift('left');
    try {
      await login(email, password);
    } finally {
      setTimeout(() => setButtonShift(null), 300);
    }
  };

  const handleSignUpClick = () => {
    setButtonShift('right');
    setTimeout(() => {
      setButtonShift(null);
      navigate('/signup');
    }, 300);
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-6" style={slideIn(0)}>
        Login
      </h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        disabled={isLoading}
        onChange={e => setEmail(e.target.value)}
        className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        style={slideIn(0.3)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        disabled={isLoading}
        onChange={e => setPassword(e.target.value)}
        className="w-full mb-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        style={slideIn(0.6)}
      />

      <div className="text-right mb-4 text-sm text-blue-600 hover:underline" style={slideIn(0.9)}>
        <a href="#">Forget your password?</a>
      </div>

      <div className="flex gap-4 justify-center" style={slideIn(1.2)}>
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className={`flex-1 py-2 px-4 text-white font-semibold rounded-full transition-all duration-300 shadow-md bg-gradient-to-r from-indigo-500 to-blue-500 ${
            buttonShift === 'left' ? 'transform -translate-x-3 bg-gradient-to-r from-blue-500 to-indigo-500' : ''
          }`}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>

        <button
          onClick={handleSignUpClick}
          className={`flex-1 py-2 px-4 text-white font-semibold rounded-full transition-all duration-300 shadow-md bg-gradient-to-r from-pink-500 to-orange-500 ${
            buttonShift === 'right' ? 'transform translate-x-3 bg-gradient-to-r from-orange-500 to-pink-500' : ''
          }`}
        >
          Sign Up
        </button>
      </div>

      <p className="text-center text-sm text-gray-600 mt-6" style={slideIn(1.5)}>
        Don’t have an account?{' '}
        <button onClick={handleSignUpClick} className="text-blue-500 hover:underline">
          Sign Up
        </button>
      </p>
    </div>
  );
}
