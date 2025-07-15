import React, { createContext, useState, useContext, ReactNode, useEffect, useMemo } from "react";
import { supabase } from "../../lib/supabaseClient";
import { apiGet } from '../../utils/apiUtils';

// Define a type for Leagues

type Leagues = {
  leagueId: string;
  moderatorArray: string[];
  leagueName: string;
  participants: string[];
  leagueImage: string;
};

// Define a type for your context state
export type UserDataType = {
  role: string;
  leagues: Leagues[];
  quinipolosToAnswer: any[];
  userId: string;
  moderatedLeagues: string[];
  emailAddress: string;
  username: string;
  hasBeenChecked: boolean;
  isRegistered: boolean;
  stripeCustomerId?: string;
  isPro?: boolean;
  productId?: string;
};

// Define a type for the context value
type UserContextType = {
  userData: UserDataType;
  updateUser: (newData: any) => void;
};

// Create a context with a default value
const UserContext = createContext<UserContextType | undefined>(undefined);

// Define a type for the provider props
type UserProviderProps = {
  children: ReactNode;
};

// Export the provider as a named export
export const UserProvider = ({ children }: UserProviderProps) => {
  const [userData, setUserData] = useState<UserDataType>({
    role: "",
    leagues: [],
    quinipolosToAnswer: [],
    userId: localStorage.getItem("userId") ?? "",
    moderatedLeagues: [],
    emailAddress: "",
    username: localStorage.getItem("username") ?? "",
    hasBeenChecked: false,
    isRegistered: false,
  });

  const updateUser = (newData: Partial<UserDataType>) => {
    const merged = { ...userData, ...newData };
    // Only update if something actually changed
    const changed = Object.keys(newData).some(
      key => merged[key as keyof UserDataType] !== userData[key as keyof UserDataType]
    );
    if (changed) {
      // Optionally update localStorage for specific fields
      if (newData.userId) localStorage.setItem("userId", newData.userId);
      if (newData.username) localStorage.setItem("username", newData.username);
      if (newData.emailAddress) localStorage.setItem("emailAddress", newData.emailAddress);
      setUserData(merged);
    }
  };


  return (
    <UserContext.Provider value={{ userData, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
