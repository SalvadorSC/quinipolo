import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';

const AuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Get the redirect_to parameter from the URL
    const redirectTo = searchParams.get('redirect_to') || 'quinipolo://';
    
    // Extract the token and other params
    const token = searchParams.get('token');
    const type = searchParams.get('type');
    
    if (token && type === 'magiclink') {
      // Construct the deep link URL
      const deepLinkUrl = `${redirectTo}auth/callback?token=${token}&type=${type}`;
      
      // Try to open the mobile app
      window.location.href = deepLinkUrl;
      
      // Fallback: if the app doesn't open, show a message
      setTimeout(() => {
        alert('Please open the Quinipolo app to complete authentication');
      }, 2000);
    } else {
      // If no valid token/type, redirect to home after a delay
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
    }
  }, [searchParams]);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: 2,
        backgroundColor: 'background.default',
        color: 'text.primary'
      }}
    >
      <CircularProgress size={60} />
      <Typography variant="h4" component="h2" gutterBottom>
        Redirecting to Quinipolo app...
      </Typography>
      <Typography variant="body1" color="text.secondary">
        If the app doesn't open automatically, please open it manually.
      </Typography>
    </Box>
  );
};

export default AuthCallback; 