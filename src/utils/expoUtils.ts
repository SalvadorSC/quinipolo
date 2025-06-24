// Utility functions for Expo Go deep linking

export const getExpoGoUrl = (path: string, params: Record<string, string> = {}) => {
  // You'll need to replace this with your actual Expo development server IP
  // You can find this in your Expo CLI when you run 'expo start'
  const expoServerIP = '192.168.1.100'; // Replace with your actual IP
  const expoPort = '8081'; // Default Expo port
  
  const queryString = new URLSearchParams(params).toString();
  const fullPath = queryString ? `${path}?${queryString}` : path;
  
  return `exp://${expoServerIP}:${expoPort}/--${fullPath}`;
};

export const getCustomSchemeUrl = (path: string, params: Record<string, string> = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const fullPath = queryString ? `${path}?${queryString}` : path;
  
  return `quinipolo://${fullPath}`;
};

// Common deep link paths
export const DEEP_LINK_PATHS = {
  AUTH_CALLBACK: '/auth/callback',
} as const;

// Instructions for setting up Expo Go deep linking
export const EXPO_SETUP_INSTRUCTIONS = `
To set up Expo Go deep linking:

1. Make sure Expo Go is installed on your device
2. Run 'expo start' in your mobile app project
3. Note the IP address shown in the terminal (e.g., 192.168.1.100)
4. Update the expoServerIP in expoUtils.ts with your actual IP
5. Make sure your device and computer are on the same network
6. Scan the QR code with Expo Go or manually enter the URL

For production builds, use the custom scheme: quinipolo://
`; 