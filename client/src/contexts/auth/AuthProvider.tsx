import React, { ReactNode, useState } from "react";
import { AuthContext, AuthState, AuthError } from "./AuthContext";
import { axiosInstance } from "../AxiosInstance";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: undefined,
    loading: false,
  });

  async function signupUser(userData: {
    username: string;
    password: string;
  }): Promise<AuthError | undefined> {
    try {
      setAuthState({ ...authState, loading: true });
      await axiosInstance.post(`auth/signup`, userData);
      //getUser();
    } catch (error: unknown) {
      console.log(error);
      setAuthState({
        ...authState,
        loading: false,
      });
      //return error?.response?.data || { other: error.message };
    }
    return;
  }

  const loginUser = async (userData: {
    username: string;
    email: string;
    password: string;
  }): Promise<AuthError | undefined> => {
    try {
      setAuthState({ ...authState, loading: true });
      const response = await axiosInstance.post(`auth/signin`, userData);

      // store accessToken in local storage so it can be used by the axios instance
      const { accessToken } = response.data;
      localStorage.setItem("accessToken", accessToken);
      setAuthState({ ...authState, user: response.data.user, loading: false });
    } catch (error: unknown) {
      console.log(error);
      setAuthState({
        ...authState,
        loading: false,
      });
      //return error?.response?.data || { other: error?.message };
    }
    return;
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        signupUser,
        loginUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
