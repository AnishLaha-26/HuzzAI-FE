import React, { createContext, useContext, useState } from "react";

export type AuthData = {
  accessToken: string;
  refresh?: string; // Optional refresh token
  user?: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
};

type AuthContextType = {
  auth: AuthData | null;
  setAuth: (data: AuthData) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuthState] = useState<AuthData | null>(() => {
    const token = localStorage.getItem("accessToken");
    const userString = localStorage.getItem("user");
    
    if (token) {
      const user = userString ? JSON.parse(userString) : undefined;
      return { accessToken: token, user };
    }
    
    return null;
  });

  const setAuth = (data: AuthData) => {
    // Store tokens and user data in localStorage
    localStorage.setItem("accessToken", data.accessToken);
    // Store refresh token if it exists in the data
    if ('refresh' in data) {
      localStorage.setItem("refreshToken", data.refresh as string);
    }
    // Store user data if it exists
    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }
    // Update auth state
    setAuthState({
      accessToken: data.accessToken,
      user: data.user
    });
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setAuthState(null);
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
