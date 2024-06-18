import { createContext, useContext } from "react";
import { Location } from "../locations/LocationsContext";
import { User } from "../auth/AuthContext";

export interface Event {
  id: number;
  name: string;
  group: number;
  creator: number;
  locations: Location[] | undefined;
  startTime: number;
  endTime: number;
  availabilityStartTime: number;
  availabilityEndTime: number;
  availabilities: Availability[] | undefined;
}

export interface Availability {
  id: number;
  time: number;
  users: User[];
}

export interface EventsContextType {
  events: Array<Event>;
  getEvents: (groupId: number) => Promise<void>;
  createEvent: (
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
  ) => Promise<void>;
  createAvailability: (
    groupId: number,
    eventId: number,
    time: number
  ) => Promise<void>;
  deleteAvailability: (
    groupId: number,
    eventId: number,
    time: number
  ) => Promise<void>;
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
