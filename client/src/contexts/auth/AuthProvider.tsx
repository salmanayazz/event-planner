import React, { ReactNode, useState, useEffect } from "react";
import { AuthContext, User } from "./AuthContext";
import { axiosInstance } from "../AxiosInstance";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | undefined>();

  useEffect(() => {
    checkAuth();
  }, []);

  const signupUser = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      await axiosInstance.post(`auth/signup`, {
        username,
        email,
        password,
      });
      loginUser(email, password);
    } catch (error: unknown) {
      console.log(error);
    }
    return;
  };

  const loginUser = async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post(`auth/signin`, {
        email,
        password,
      });

      // store accessToken in local storage so it can be used by the axios instance
      const { accessToken } = response.data;
      localStorage.setItem("accessToken", accessToken);
      console.log(response.data);

      setUser({
        id: response.data.id,
        username: response.data.username,
        email: response.data.email,
      });
      console.log(user);
    } catch (error: unknown) {
      console.log(error);
    }
    return;
  };

  const checkAuth = async () => {
    try {
      const response = await axiosInstance.get(`auth/signin`);
      setUser(response.data);
    } catch (error: unknown) {
      console.log(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signupUser,
        loginUser,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
