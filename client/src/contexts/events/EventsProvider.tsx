import React, { ReactNode, useState } from "react";
import { EventsContext, Event } from "./EventsContext";
import { axiosInstance } from "../AxiosInstance";

interface EventsProviderProps {
  children: ReactNode;
}

const EventsProvider: React.FC<EventsProviderProps> = ({ children }) => {
  const [events, setEvents] = useState<Array<Event>>([]);

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

  return (
    <EventsContext.Provider value={{ events, getEvents, createEvent }}>
      {children}
    </EventsContext.Provider>
  );
};

export default EventsProvider;
