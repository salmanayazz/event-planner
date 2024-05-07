import { useState } from "react";
import { LocationsContext } from "./LocationsContext";
import { Location } from "./LocationsContext";
import { axiosInstance } from "../AxiosInstance";

interface LocationProviderProps {
  children: React.ReactNode;
}

const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
  const [locations, setLocations] = useState<Array<Location>>([]);

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
    <LocationsContext.Provider
      value={{
        locations,
        getLocations,
        createLocation,
      }}
    >
      {children}
    </LocationsContext.Provider>
  );
};

export default LocationProvider;
