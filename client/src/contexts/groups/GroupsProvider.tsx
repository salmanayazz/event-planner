import React, { ReactNode, useState } from "react";
import { GroupsContext, Group } from "./GroupsContext";
import { User } from "../auth/AuthContext";
import { axiosInstance } from "../AxiosInstance";

interface GroupsProviderProps {
  children: ReactNode;
}

export const GroupsProvider: React.FC<GroupsProviderProps> = ({ children }) => {
  const [groups, setGroups] = useState<Array<Group>>([]);

  const getGroups = async () => {
    try {
      console.log("testing");
      console.log(await axiosInstance.get(`groups`));
      const response = await axiosInstance.get(`groups`);
      setGroups(response.data);
    } catch (error: unknown) {
      console.log(error);
    }
  };

  const createGroup = async (groupName: string) => {
    try {
      await axiosInstance.post(`groups`, groupName);
      getGroups();
    } catch (error: unknown) {
      console.log(error);
    }
  };

  const addUserToGroup = async (groupId: number, user: User) => {
    try {
      await axiosInstance.post(`groups/${groupId}/user`, user);
      getGroups();
    } catch (error: unknown) {
      console.log(error);
    }
  };

  return (
    <GroupsContext.Provider
      value={{
        groups,
        getGroups,
        createGroup,
        addUserToGroup,
      }}
    >
      {children}
    </GroupsContext.Provider>
  );
};
