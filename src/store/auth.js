import { create } from "zustand";

const getInitialToken = () => {
  try {
    return localStorage.getItem("token") || "";
  } catch {
    return "";
  }
};

const getInitialUser = () => {
  try {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  } catch {
    return null;
  }
};

export const useAuthStore = create((set) => ({
  token: getInitialToken(),
  user: getInitialUser(),
  setToken: (token) => {
    try {
      localStorage.setItem("token", token);
    } catch {
      // Ignore localStorage errors
    }
    set({ token });
  },
  setUser: (user) => {
    try {
      localStorage.setItem("user", JSON.stringify(user));
    } catch {
      // Ignore localStorage errors
    }
    set({ user });
  },
  logout: () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch {
      // Ignore localStorage errors
    }
    set({ token: "", user: null });
  },
}));
