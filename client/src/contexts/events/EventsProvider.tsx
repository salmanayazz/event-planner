import React, { ReactNode, useState } from "react";
import { EventsContext, Event } from "./EventsContext";
import { axiosInstance } from "../AxiosInstance";
import { useGroups } from "../groups/GroupsContext";

interface EventsProviderProps {
  children: ReactNode;
}

const EventsProvider: React.FC<EventsProviderProps> = ({ children }) => {
  const { groups } = useGroups();
  const [events, setEvents] = useState<Array<Event>>([]);

  const getEvents = async (groupId: number) => {
    try {
      // fetch events previously fetched from groups context
      setEvents(groups.find((group) => group.id === groupId)?.events || []);

      // refetch events from server
      const response = await axiosInstance.get(`groups/${groupId}/events`);
      // get locations for each event
      Promise.all(
        response.data.map(async (event: Event) => {
          const locations = await axiosInstance.get(
            `groups/${groupId}/events/${event.id}/locations`
          );
          event.locations = locations.data;
          return event;
        })
      ).then((events) => {
        setEvents(events);
      });
    } catch (error: unknown) {
      console.log(error);
      return [];
    }
  };

  const createEvent = async (
    groupId: number,
    data?: {
      name: string;
      startTime?: number;
      endTime?: number;
      availabilityStartTime?: number;
      availabilityEndTime?: number;
      location?: Location;
      votingEndTime?: number;
    }
  ) => {
    try {
      await axiosInstance.post(`groups/${groupId}/events`, data);
      getEvents(groupId);
    } catch (error: unknown) {
      console.log(error);
    }
  };

  return (
    <EventsContext.Provider value={{ events, getEvents, createEvent }}>
      {children}
    </EventsContext.Provider>
  );
};

export default EventsProvider;
