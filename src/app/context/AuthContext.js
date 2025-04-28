"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { logoutUser } from "@/app/services/authService"; // Adjust path if needed

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleSetUser = (userData) => {
    if (userData) {
      sessionStorage.setItem("user", JSON.stringify(userData));
    } else {
      sessionStorage.removeItem("user");
    }
    setUser(userData);
  };

  const logout = async () => {
    try {
      await logoutUser(); // Clears cookie + session + redirects
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null); // Just in case redirect is skipped
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser: handleSetUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
