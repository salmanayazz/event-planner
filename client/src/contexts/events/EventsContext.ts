import { createContext, useContext } from "react";
import { Location } from "../locations/LocationsContext";

export interface Event {
  id: number;
  name: string;
  group: number;
  creator: number;
  locations: Location[] | undefined;
}

export interface EventsContextType {
  events: Array<Event>;
  getEvents: (groupId: number) => Promise<never[] | undefined>;
  createEvent: (groupId: number, eventName: string) => Promise<void>;
}

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error("useEvents must be used within a EventsProvider");
  }
  return context;
};

export const EventsContext = createContext<EventsContextType | undefined>(
  undefined
);
