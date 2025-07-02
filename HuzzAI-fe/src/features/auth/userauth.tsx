import React, { createContext, useContext, useState } from "react";

export type AuthData = {
  accessToken: string;
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
    localStorage.setItem("accessToken", data.accessToken);
    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }
    setAuthState(data);
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
