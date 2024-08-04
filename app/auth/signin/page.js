"use client";

import { signIn } from "next-auth/react";
import { Box, Button, Typography, CircularProgress, Alert } from '@mui/material';
import { useState } from 'react';

const SignInPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      // Redirect to home page after successful sign-in
      await signIn('google', { callbackUrl: '/' });
    } catch (error) {
      console.error(error);
      setError('Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 2 }}>
      <Typography variant="h4">Sign In</Typography>
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

export default SignInPage;
