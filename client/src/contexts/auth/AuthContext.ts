import { createContext, useContext } from "react";

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface AuthError {
  username: string | undefined;
  email: string | undefined;
  password: string | undefined;
  message: string | undefined;
}

export interface AuthContextType {
  user: User | undefined;
  registerUser: (
    username: string,
    email: string,
    password: string
  ) => Promise<AuthError | undefined>;
  loginUser: (
    email: string,
    password: string
  ) => Promise<AuthError | undefined>;
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
