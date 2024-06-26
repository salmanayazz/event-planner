import { useState } from "react";
import { LocationsContext } from "./LocationsContext";
import { Location } from "./LocationsContext";
import { axiosInstance } from "../AxiosInstance";
import { useEvents } from "../events/EventsContext";

interface LocationProviderProps {
  children: React.ReactNode;
}

const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
  const { events } = useEvents();
  const [locations, setLocations] = useState<Array<Location>>([]);

  const getLocations = async (groupId: number, eventId: number) => {
    try {
      // fetch locations previously fetched from events context
      setLocations(
        events.find((event) => event.id === eventId)?.locations || []
      );

      // refetch for updates
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

  const castVote = async (
    groupId: number,
    eventId: number,
    locationId: number
  ) => {
    try {
      await axiosInstance.post(
        `groups/${groupId}/events/${eventId}/locations/${locationId}/votes`
      );
      getLocations(groupId, eventId);
    } catch (error: unknown) {
      console.log(error);
    }
  };

  const deleteVote = async (
    groupId: number,
    eventId: number,
    locationId: number
  ) => {
    try {
      await axiosInstance.delete(
        `groups/${groupId}/events/${eventId}/locations/${locationId}/votes`
      );
      getLocations(groupId, eventId);
    } catch (error: unknown) {
      console.log(error);
    }
  };

  return (
    <LocationsContext.Provider
      value={{
        locations,
        getLocations,
        createLocation,
        castVote,
        deleteVote,
      }}
    >
      {children}
    </LocationsContext.Provider>
  );
};

export default LocationProvider;
