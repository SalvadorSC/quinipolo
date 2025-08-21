import { createClient } from "@supabase/supabase-js";
import { AUTH_TOKEN_STORAGE_KEY } from "../utils/config";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Debug logging (development only)
if (process.env.NODE_ENV === "development") {
  console.log("Supabase URL:", supabaseUrl);
  console.log("Supabase Anon Key exists:", !!supabaseAnonKey);
}

// Check if environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables:");
  console.error("REACT_APP_SUPABASE_URL:", supabaseUrl ? "Set" : "Missing");
  console.error(
    "REACT_APP_SUPABASE_ANON_KEY:",
    supabaseAnonKey ? "Set" : "Missing"
  );
  console.error(
    "Please create a .env file in the quinipolo-fe directory with:"
  );
  console.error("REACT_APP_SUPABASE_URL=your_supabase_url");
  console.error("REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key");
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "", {
  auth: {
    persistSession: true,
    storageKey: AUTH_TOKEN_STORAGE_KEY,
    storage: {
      getItem: (key) => {
        try {
          return localStorage.getItem(key);
        } catch {
          return null;
        }
      },
      setItem: (key, value) => {
        try {
          localStorage.setItem(key, value);
        } catch {
          // Handle storage errors gracefully
        }
      },
      removeItem: (key) => {
        try {
          localStorage.removeItem(key);
        } catch {
          // Handle storage errors gracefully
        }
      },
    },
  },
});
