import { createContext, useContext } from "react";

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface AuthContextType {
  user: User | undefined;
  signupUser: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  loginUser: (email: string, password: string) => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
