"use client";
import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export const AuthContext = createContext<{
  user: any;
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    password: string,
    mobile: string,
    vehicleNumber: string
  ) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
} | null>(null);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      setUser(userData);
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      // Ensure API URL is defined before making request
      if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error("API URL is not configured");
      }

      const res = await fetch(`${process.env.API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (data.status === "success") {
        localStorage.setItem("token", data.token);
        document.cookie = `token=${data.token}; path=/; max-age=86400`;
        localStorage.setItem("user", JSON.stringify(data.data.user));
        setUser(data.data.user);
      } else {
        throw new Error(data.message);
      }
      router.push("/dashboard");
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const register = async (
    username: string,
    password: string,
    mobile: string,
    vehicleNumber: string
  ) => {
    try {
      const res = await fetch(`${process.env.API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          username,
          password,
          mobile,
          vehicleNumber,
        }),
      });
      const data = await res.json();

      if (data.status === "success") {
        localStorage.setItem("token", data.token);
        document.cookie = `token=${data.token}; path=/; max-age=86400`;
        localStorage.setItem("user", JSON.stringify(data.data.user));
        setUser(data.data.user);
      } else {
        throw new Error(data.message);
      }
      router.push("/dashboard");
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    document.cookie = "token=; path=/; max-age=0";
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
