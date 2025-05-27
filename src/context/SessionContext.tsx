"use client";
import { adminSignUp, signIn } from "@/lib/routes/auth";
import { verifyToken } from "@/lib/routes/requests";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isSuperadmin?: boolean;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface SessionContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

// Update your SessionProvider component
export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Add this function to verify and refresh user data
  const verifyAndRefreshSession = async (storedToken: string) => {
    try {
      const userData = await verifyToken();
      setUser({
        id: userData.id,
        email: userData.email,
        firstName: userData.first_name,
        lastName: userData.last_name,
        isSuperadmin: userData.is_superadmin
      });
      setToken(storedToken);
    } catch (error) {
      console.error("Session verification failed:", error);
      logout();
    }
  };

  useEffect(() => {
    const initializeSession = async () => {
      try {
        const storedToken = localStorage.getItem("authToken");
        const storedUser = localStorage.getItem("user");

        if (storedToken) {
          if (storedUser) {
            // Verify the token is still valid
            await verifyAndRefreshSession(storedToken);
          } else {
            // If we have token but no user data, fetch fresh data
            const userData = await verifyToken();
            localStorage.setItem("user", JSON.stringify({
              id: userData.id,
              email: userData.email,
              firstName: userData.first_name,
              lastName: userData.last_name,
              isSuperadmin: userData.is_superadmin
            }));
            setUser({
              id: userData.id,
              email: userData.email,
              firstName: userData.first_name,
              lastName: userData.last_name,
              isSuperadmin: userData.is_superadmin
            });
            setToken(storedToken);
          }
        }
      } catch (error) {
        console.error("Session initialization error:", error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeSession();

    // Optional: Set up periodic token verification
    const interval = setInterval(() => {
      const token = localStorage.getItem("authToken");
      if (token) {
        verifyAndRefreshSession(token).catch(console.error);
      }
    }, 300000); // Every 5 minutes

    return () => clearInterval(interval);
  }, []);

  // Update your login function to store more user data
  const login = async (email: string, password: string) => {
    try {
      const response = await signIn({ email, password });
      if (response.token && response.user) {
        localStorage.setItem("authToken", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        setToken(response.token);
        setUser(response.user);

        // Fetch complete user data after login
        const userData = await verifyToken();
        setUser({
          id: userData.id,
          email: userData.email,
          firstName: userData.first_name,
          lastName: userData.last_name,
          isSuperadmin: userData.is_superadmin
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const signup = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    try {
      const response = await adminSignUp({
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        password: data.password,
        bio: "", // Add bio if needed
      });
      return response;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  return (
    <SessionContext.Provider
      value={{ user, token, isLoading, login, logout, signup }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
