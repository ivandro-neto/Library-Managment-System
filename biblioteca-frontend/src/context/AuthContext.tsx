import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

interface User {
  username: string;
  roles: number[];
}

interface AuthContextProps {
  user: User | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  accessToken: null,
  login: async () => {},
  logout: () => {},
  refreshAccessToken: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem("accessToken"));
  const [user, setUser] = useState<User | null>(JSON.parse(localStorage.getItem("user") || "null"));

  const apiBaseURL = "http://localhost:3000/api/auth";

  // Persist data securely
  const persistAuthData = (accessToken: string, user: User) => {
    setAccessToken(accessToken);
    setUser(user);
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("user", JSON.stringify(user));
  };

  // Função de login
  const login = useCallback(async (email: string, password: string) => {
    try {
      const { data } = await axios.post(`${apiBaseURL}/login`, { email, password });
      const { accessToken, refreshToken } = data;

      const decodedToken: any = JSON.parse(atob(accessToken.split(".")[1]));
      const user = { username: decodedToken.username, email:decodedToken.email, roles: [decodedToken.roles] };

      persistAuthData(accessToken, user);
      localStorage.setItem("refreshToken", refreshToken);
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error("Invalid credentials.");
    }
  }, []);

  // Função de logout
  const logout = useCallback(() => {
    setAccessToken(null);
    setUser(null);

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  }, []);

  // Renovar token de acesso
  const refreshAccessToken = useCallback(async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      logout();
      return;
    }

    try {
      const { data } = await axios.post(`${apiBaseURL}/refresh`, { refreshToken });
      const { accessToken } = data;
      const decodedToken: any = JSON.parse(atob(accessToken.split(".")[1]));
      const user = {id: decodedToken.sub, username: decodedToken.username, email:decodedToken.email, roles: [decodedToken.roles] };

      persistAuthData(accessToken, user);
    } catch (error) {
      console.error("Token refresh failed:", error);
      logout();
    }
  }, [logout]);

  // Verificar e renovar token automaticamente
  useEffect(() => {
    if (accessToken) {
      const decodedToken: any = JSON.parse(atob(accessToken.split(".")[1]));
      const expirationTime = decodedToken.exp * 1000 - Date.now();

      if (expirationTime <= 0) {
        refreshAccessToken();
      } else {
        const timeout = setTimeout(refreshAccessToken, expirationTime);
        return () => clearTimeout(timeout);
      }
    }
  }, [accessToken, refreshAccessToken]);

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};
