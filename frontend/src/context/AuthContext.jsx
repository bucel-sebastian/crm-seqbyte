import { createContext, useContext, useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setSession(decodedToken);
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem("auth_token", token);
    const decodedToken = jwtDecode(token);
      setSession(decodedToken);
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setSession(null);
  };
  return (
    <AuthContext.Provider value={{ session, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
