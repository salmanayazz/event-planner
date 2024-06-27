import React, { ReactNode, useEffect, useState } from "react";
import { GroupsContext, Group } from "./GroupsContext";
import { axiosInstance } from "../AxiosInstance";

interface GroupsProviderProps {
  children: ReactNode;
}

export const GroupsProvider: React.FC<GroupsProviderProps> = ({ children }) => {
  const [groups, setGroups] = useState<Array<Group>>([]);

  useEffect(() => {
    getGroups();
  }, []);

  const getGroups = async () => {
    try {
      setGroups((await axiosInstance.get(`groups`)).data);
    } catch (error: unknown) {
      console.log(error);
    }
  };

  const createGroup = async (groupName: string) => {
    try {
      await axiosInstance.post(`groups`, {
        name: groupName,
      });
      await getGroups();
    } catch (error: unknown) {
      console.log(error);
    }
  };

  const editGroup = async (groupId: number, groupName: string) => {
    try {
      await axiosInstance.put(`groups/${groupId}`, {
        name: groupName,
      });
      await getGroups();
    } catch (error: unknown) {
      console.log(error);
    }
  };

  const deleteGroup = async (groupId: number) => {
    try {
      await axiosInstance.delete(`groups/${groupId}`);
      await getGroups();
    } catch (error: unknown) {
      console.log(error);
    }
  };

  const addUserToGroup = async (groupId: number, username: string) => {
    try {
      await axiosInstance.post(`groups/${groupId}/users`, {
        username: username,
      });
      await getGroups();
    } catch (error: unknown) {
      console.log(error);
    }
  };

  const deleteUserFromGroup = async (groupId: number, userId: number) => {
    try {
      await axiosInstance.delete(`groups/${groupId}/users/${userId}`);
      await getGroups();
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
        editGroup,
        deleteGroup,
        addUserToGroup,
        deleteUserFromGroup,
      }}
    >
      {children}
    </GroupsContext.Provider>
  );
};

export default GroupsProvider;
