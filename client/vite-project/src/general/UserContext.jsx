import React, { createContext, useState, useEffect, useCallback } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetchMe = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Attempting to fetch /api/me...");
      const res = await fetch("/api/me", { credentials: "include" });
      console.log("Response status:", res.status);
      console.log("Response headers:", [...res.headers.entries()]);
      
      if (res.ok) {
        const data = await res.json();
        console.log("Response data:", data);
        setUser(data.user ?? null);
        
      } else {
        console.log("Response not ok, status:", res.status);
        const errorText = await res.text();
        console.log("Error response body:", errorText);
        setUser(null);
      }
    } catch (e) {
      console.error("Fetch error:", e);
      setUser(null);
      setError("Failed to load session");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMe(); }, [fetchMe]);

  const login = async (username, password) => {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) {
      const msg = (await res.json().catch(() => ({}))).message || "Login failed";
      throw new Error(msg);
    }
    await fetchMe();
  };

  const logout = async () => {
    await fetch("/api/logout", { method: "POST", credentials: "include" });
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ 
      user,
      loading,
      error,
      login,
      logout,
      refresh: fetchMe
    }}>
      {children}
    </UserContext.Provider>
  );
}