// Environment configuration utility
export const config = {
  // Base URL for the application
  baseUrl:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3001"
      : window.location.origin,

  // API base URL
  apiBaseUrl: process.env.REACT_APP_API_BASE_URL || "http://localhost:3000",

  // Supabase configuration
  supabase: {
    url: process.env.REACT_APP_SUPABASE_URL,
    anonKey: process.env.REACT_APP_SUPABASE_ANON_KEY,
  },

  // Environment
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
};

// Helper function to get redirect URLs
export const getRedirectUrl = (path: string): string => {
  return `${config.baseUrl}${path}`;
};

