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

  const registerUser = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      await axiosInstance.post(`auth/register`, {
        username,
        email,
        password,
      });

      return loginUser(email, password);
    } catch (error: any) {
      console.log(error);
      console.log(error?.response?.data);
      return error?.response?.data || { message: error.message };
    }
  };

  const loginUser = async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post(`auth/login`, {
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
    } catch (error: any) {
      console.log(error);
      return error?.response?.data || { message: error.message };
    }
  };

  const checkAuth = async () => {
    try {
      const response = await axiosInstance.get(`auth/login`);
      setUser(response.data);
    } catch (error: unknown) {
      console.log(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        registerUser,
        loginUser,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
