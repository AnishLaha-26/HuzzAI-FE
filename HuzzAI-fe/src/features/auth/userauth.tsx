import React,{ createContext, useContext, useState } from "react";

type AuthData = {
  accessToken: string;
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
    return token ? { accessToken: token } : null;
  });

  const setAuth = (data: AuthData) => {
    localStorage.setItem("accessToken", data.accessToken);
    setAuthState(data);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
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
