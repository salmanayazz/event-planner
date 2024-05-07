import React, { ReactNode, useEffect, useState } from "react";
import { GroupsContext, Group, Event, Location } from "./GroupsContext";
import { axiosInstance } from "../AxiosInstance";

interface GroupsProviderProps {
  children: ReactNode;
}

export const GroupsProvider: React.FC<GroupsProviderProps> = ({ children }) => {
  const [groups, setGroups] = useState<Array<Group>>([]);
  const [events, setEvents] = useState<Array<Event>>([]);
  const [locations, setLocations] = useState<Array<Location>>([]);

  useEffect(() => {
    getGroups();
  }, []);

  const getGroups = async () => {
    try {
      const response = await axiosInstance.get(`groups`);
      setGroups(response.data);
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

  const getEvents = async (groupId: number) => {
    try {
      const response = await axiosInstance.get(`groups/${groupId}/events`);
      setEvents(response.data);
    } catch (error: unknown) {
      console.log(error);
      return [];
    }
  };

  const createEvent = async (groupId: number, eventName: string) => {
    try {
      await axiosInstance.post(`groups/${groupId}/events`, {
        name: eventName,
      });
      getEvents(groupId);
    } catch (error: unknown) {
      console.log(error);
    }
  };

  const getLocations = async (groupId: number, eventId: number) => {
    try {
      const response = await axiosInstance.get(
        `groups/${groupId}/events/${eventId}/locations`
      );
      setLocations(response.data);
    } catch (error: unknown) {
      console.log(error);
    }
  };

  const createLocation = async (
    groupId: number,
    eventId: number,
    locationName: string,
    address: string,
    photoUrl: string
  ) => {
    try {
      await axiosInstance.post(
        `groups/${groupId}/events/${eventId}/locations`,
        {
          name: locationName,
          address: address,
          photoUrl: photoUrl,
        }
      );
      getLocations(groupId, eventId);
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
        deleteUserFromGroup,
        events,
        getEvents,
        createEvent,
        locations,
        getLocations,
        createLocation,
      }}
    >
      {children}
    </GroupsContext.Provider>
  );
};
