import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      setUser(JSON.parse(atob(token.split(".")[1])));
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem("auth_token", token);
    setUser(JSON.parse(atob(token.split(".")[1])));
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setUser(null);
  };
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
