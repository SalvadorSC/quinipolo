import React, { createContext, useState, useContext, ReactNode } from "react";

// Define a type for Leagues

/* 
{"_id":{"$oid":"6687e4a78d344eb01bbcd067"},"leagueId":"global","moderatorArray":["salvadorsc"],"leagueName":"Global","participants":["salvadorsc"], leagueImg: "IMG"*/

type Leagues = {
  leagueId: string;
  moderatorArray: string[];
  leagueName: string;
  participants: string[];
  leagueImage: string;
};

// Define a type for your context state
type UserDataType = {
  role: string;
  leagues: Leagues[];
  quinipolosToAnswer: any[];
  userId: string;
  moderatedLeagues: string[];
  emailAddress: string;
  username: string;
  isRegistered: boolean;
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
    username: "",
    isRegistered: false,
  });

  const updateUser = (newData: any) => {
    setUserData({ ...userData, ...newData });
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
