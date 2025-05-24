import React, { useState, useEffect } from 'react';
import { TextField, Typography, Box, Button, Link, Stack } from '@mui/material';
import { useAuth } from '../context/authContext'; // Adjust path as needed

// CSS styles for sliding animation and button shifting
const styles = {
  container: {
    maxWidth: 400,
    margin: 'auto',
    marginTop: 64,
    padding: 32,
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    borderRadius: 12,
    backgroundColor: 'white',
  },
  slideIn: (delay: number) => ({
    opacity: 0,
    animation: `slideIn 0.5s ease forwards`,
    animationDelay: `${delay}s`,
  }),
  '@keyframes slideIn': {
    from: { opacity: 0, transform: 'translateX(-50px)' },
    to: { opacity: 1, transform: 'translateX(0)' },
  },
  gradientButton: {
    background: 'linear-gradient(45deg, #6a11cb, #2575fc)',
    color: 'white',
    fontWeight: 'bold',
    padding: '10px 30px',
    borderRadius: 30,
    textTransform: 'none',
    boxShadow: '0 3px 15px rgba(101, 49, 255, 0.4)',
    transition: 'transform 0.3s ease, background 0.3s ease',
    cursor: 'pointer',
  },
  gradientButtonPressedLeft: {
    transform: 'translateX(-15px)',
    background: 'linear-gradient(45deg, #2575fc, #6a11cb)',
  },
  gradientButtonPressedRight: {
    transform: 'translateX(15px)',
    background: 'linear-gradient(45deg, #2575fc, #6a11cb)',
  },
};

export const loginRoute: React.FC = () => {
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [buttonShift, setButtonShift] = useState<'left' | 'right' | null>(null);

  // Add keyframes to the document stylesheet (since we can't do styled components here)
  useEffect(() => {
    const styleSheet = document.styleSheets[0];
    if (styleSheet) {
      const keyframes = 
        `@keyframes slideIn {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }`;
      if (![...styleSheet.cssRules].some(rule => rule.name === 'slideIn')) {
        styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
      }
    }
  }, []);

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
    // Handle signup redirect or logic here
    setTimeout(() => setButtonShift(null), 300);
  };

  return (
    <Box sx={styles.container}>
      <Typography
        variant="h4"
        component="h1"
        fontWeight="bold"
        sx={styles.slideIn(0)}
        gutterBottom
        textAlign="center"
      >
        Login
      </Typography>

      <TextField
        label="Email"
        type="email"
        fullWidth
        value={email}
        onChange={e => setEmail(e.target.value)}
        disabled={isLoading}
        sx={styles.slideIn(0.3)}
        margin="normal"
      />

      <TextField
        label="Password"
        type="password"
        fullWidth
        value={password}
        onChange={e => setPassword(e.target.value)}
        disabled={isLoading}
        sx={styles.slideIn(0.6)}
        margin="normal"
      />

      <Box sx={{ textAlign: 'right', mb: 2, ...styles.slideIn(0.9) }}>
        <Link href="#" underline="hover" fontSize={14}>
          Forget your password?
        </Link>
      </Box>

      <Stack direction="row" spacing={2} justifyContent="center" sx={styles.slideIn(1.2)}>
        <Button
          onClick={handleLogin}
          disabled={isLoading}
          sx={{
            ...styles.gradientButton,
            ...(buttonShift === 'left' ? styles.gradientButtonPressedLeft : {}),
            flex: 1,
          }}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>

        <Button
          onClick={handleSignUpClick}
          sx={{
            ...styles.gradientButton,
            background: 'linear-gradient(45deg, #ff416c, #ff4b2b)',
            ...(buttonShift === 'right' ? styles.gradientButtonPressedRight : {}),
            flex: 1,
          }}
        >
          Sign Up
        </Button>
      </Stack>

      <Typography
        variant="body2"
        color="textSecondary"
        textAlign="center"
        mt={3}
        sx={styles.slideIn(1.5)}
      >
        Don’t have an account?{' '}
        <Link href="#" underline="hover" onClick={handleSignUpClick}>
          Sign Up
        </Link>
      </Typography>
    </Box>
  );
};
