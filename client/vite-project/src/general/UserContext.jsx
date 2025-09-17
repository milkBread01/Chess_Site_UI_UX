import { useState, useEffect, useCallback, createContext } from "react";

export const UserContext = createContext();

const API_BASE = import.meta.env.VITE_API_URL || "";

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMe = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      //console.log("Fetching from:", `${API_BASE}api/me`);
      const res = await fetch(`${API_BASE}api/me`, 
        { credentials: "include" }
      );

      if (res.ok) {

        const data = await res.json();
        setUser(data.user ?? null);

      } else if (res.status === 401) {

        setUser(null);

      } else {

        const errorText = await res.text();
        setUser(null);
        setError(`Server error: ${res.status}`);
      }
    } catch (e) {
      //console.error("Network error:", e);
      setUser(null);
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMe(); }, [fetchMe]);

  const login = async (username, password) => {
    const res = await fetch(`${API_BASE}api/login`, {
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
    await fetch(`${API_BASE}api/logout`, { 
      method: "POST", 
      credentials: "include" 
    });
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