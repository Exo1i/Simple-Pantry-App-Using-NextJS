// app/Login.js
"use client";

import { useState } from 'react';
import { auth } from '../../firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { Box, Button, Typography, CircularProgress, Alert } from '@mui/material';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignIn = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError('Failed to sign in. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4">Login</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Button
        variant="contained"
        color="primary"
        onClick={handleSignIn}
        disabled={loading}
        startIcon={loading && <CircularProgress size={20} />}
      >
        {loading ? 'Signing in...' : 'Sign In with Google'}
      </Button>
    </Box>
  );
};

export default Login;
