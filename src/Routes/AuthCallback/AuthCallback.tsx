import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import { getExpoGoUrl, getCustomSchemeUrl, DEEP_LINK_PATHS } from '../../utils/expoUtils';

const AuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<string>('Processing...');
  const [deepLinkUrl, setDeepLinkUrl] = useState<string>('');
  const [expoUrl, setExpoUrl] = useState<string>('');

  useEffect(() => {
    // Extract the token and other params
    const token = searchParams.get('token');
    const type = searchParams.get('type');
    
    if (token && type === 'magiclink') {
      // Create both Expo Go and custom scheme URLs
      const expoDeepLinkUrl = getExpoGoUrl(DEEP_LINK_PATHS.AUTH_CALLBACK, { token, type });
      const customSchemeUrl = getCustomSchemeUrl(DEEP_LINK_PATHS.AUTH_CALLBACK, { token, type });
      
      setExpoUrl(expoDeepLinkUrl);
      setDeepLinkUrl(customSchemeUrl);
      setStatus('Attempting to open Expo Go...');
      
      // Try to open the mobile app
      try {
        // First try Expo Go
        window.location.href = expoDeepLinkUrl;
        
        // Fallback to custom scheme after a short delay
        setTimeout(() => {
          setStatus('Trying custom scheme...');
          window.location.href = customSchemeUrl;
        }, 1000);
        
        // Final fallback: show manual instructions
        setTimeout(() => {
          setStatus('App not opened automatically');
        }, 3000);
        
      } catch (error) {
        console.error('Error opening deep link:', error);
        setStatus('Error opening app');
      }
    } else {
      setStatus('Invalid token or type');
      // If no valid token/type, redirect to home after a delay
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
    }
  }, [searchParams]);

  const handleManualOpen = (url: string) => {
    window.location.href = url;
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setStatus('Link copied to clipboard!');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: 3,
        backgroundColor: 'background.default',
        color: 'text.primary',
        padding: 2
      }}
    >
      <CircularProgress size={60} />
      <Typography variant="h4" component="h2" gutterBottom>
        Redirecting to Quinipolo app...
      </Typography>
      <Typography variant="body1" color="text.secondary" textAlign="center">
        {status}
      </Typography>
      
      {status === 'App not opened automatically' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            If the app doesn't open automatically, try one of these options:
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%', maxWidth: 300 }}>
            <Typography variant="subtitle2" color="primary">
              For Expo Go (Development):
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => handleManualOpen(expoUrl)}
              size="small"
            >
              Open in Expo Go
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => handleCopyLink(expoUrl)}
              size="small"
            >
              Copy Expo Go Link
            </Button>
            
            <Typography variant="subtitle2" color="primary" sx={{ mt: 2 }}>
              For Production App:
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => handleManualOpen(deepLinkUrl)}
              size="small"
            >
              Open in Quinipolo App
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => handleCopyLink(deepLinkUrl)}
              size="small"
            >
              Copy App Link
            </Button>
          </Box>
          
          <Typography variant="caption" color="text.secondary" textAlign="center" sx={{ maxWidth: 400 }}>
            Make sure Expo Go is installed and running, or that your Quinipolo app is installed.
          </Typography>
        </Box>
      )}
      
      {(expoUrl || deepLinkUrl) && (
        <Box sx={{ 
          backgroundColor: 'background.paper', 
          padding: 2, 
          borderRadius: 1, 
          maxWidth: 400,
          width: '100%'
        }}>
          <Typography variant="caption" color="text.secondary">
            Debug - Deep Link URLs:
          </Typography>
          {expoUrl && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Expo Go:
              </Typography>
              <Typography variant="body2" fontFamily="monospace" fontSize="0.7rem" sx={{ wordBreak: 'break-all' }}>
                {expoUrl}
              </Typography>
            </Box>
          )}
          {deepLinkUrl && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Custom Scheme:
              </Typography>
              <Typography variant="body2" fontFamily="monospace" fontSize="0.7rem" sx={{ wordBreak: 'break-all' }}>
                {deepLinkUrl}
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default AuthCallback; 