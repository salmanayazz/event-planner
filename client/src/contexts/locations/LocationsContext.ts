import { createContext, useContext } from "react";
import { User } from "../auth/AuthContext";

export interface Location {
  id: number;
  name: string;
  address: string;
  photoUrl: string;
  event: Event;
  creator: User;
  voters: Array<User>;
}

export interface LocationsContextType {
  locations: Array<Location>;
  getLocations: (groupId: number, eventId: number) => Promise<void>;
  createLocation: (
    groupId: number,
    eventId: number,
    locationName: string,
    address: string,
    photoUrl: string
  ) => Promise<void>;
  castVote: (
    groupId: number,
    eventId: number,
    locationId: number
  ) => Promise<void>;
}

export const useLocations = () => {
  const context = useContext(LocationsContext);
  if (!context) {
    throw new Error("useLocations must be used within a LocationsProvider");
  }
  return context;
};

export const LocationsContext = createContext<LocationsContextType | undefined>(
  undefined
);
