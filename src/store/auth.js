import { create } from "zustand";

const getInitialToken = () => {
  try {
    return localStorage.getItem("token") || "";
  } catch {
    return "";
  }
};

export const useAuthStore = create((set) => ({
  token: getInitialToken(),
  setToken: (token) => {
    try {
      localStorage.setItem("token", token);
    } catch {
      // Ignore localStorage errors
    }
    set({ token });
  },
}));
