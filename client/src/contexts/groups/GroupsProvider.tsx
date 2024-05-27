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
      const response = await axiosInstance.get(`groups`);

      // get events for each group
      Promise.all(
        response.data.map(async (group: Group) => {
          const events = await axiosInstance.get(`groups/${group.id}/events`);
          group.events = events.data;
          return group;
        })
      ).then((groups) => {
        setGroups(groups);
      });
    } catch (error: unknown) {
      console.log(error);
    }
  };

  const createGroup = async (groupName: string) => {
    try {
      await axiosInstance.post(`groups`, {
        name: groupName,
      });
      getGroups();
    } catch (error: unknown) {
      console.log(error);
    }
  };

  const deleteGroup = async (groupId: number) => {
    try {
      await axiosInstance.delete(`groups/${groupId}`);
      getGroups();
    } catch (error: unknown) {
      console.log(error);
    }
  };

  const addUserToGroup = async (groupId: number, username: string) => {
    try {
      await axiosInstance.post(`groups/${groupId}/users`, {
        username: username,
      });
      getGroups();
    } catch (error: unknown) {
      console.log(error);
    }
  };

  const deleteUserFromGroup = async (groupId: number, userId: number) => {
    try {
      await axiosInstance.delete(`groups/${groupId}/users/${userId}`);
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
