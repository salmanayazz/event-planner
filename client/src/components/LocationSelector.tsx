import { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Input,
} from "@chakra-ui/react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  StandaloneSearchBox,
} from "@react-google-maps/api";
import { useLocations } from "../contexts/locations/LocationsContext";

interface LocationSelectorProps {
  groupId: number;
  eventId: number;
  onClose: () => void;
  isOpen: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const libraries: any = ["places"];

export default function LocationSelector({
  groupId,
  eventId,
  onClose,
  isOpen,
}: LocationSelectorProps) {
  const { createLocation } = useLocations();

  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult>();
  const [searchBox, setSearchBox] =
    useState<google.maps.places.SearchBox | null>();

  const handleCreateLocation = async () => {
    if (selectedPlace) {
      const locationName = selectedPlace.name;
      const address = selectedPlace.formatted_address;
      const placeId = selectedPlace.place_id;

      if (locationName && address && placeId) {
        const placesService = new google.maps.places.PlacesService(
          document.createElement("div")
        );

        placesService.getDetails(
          {
            placeId,
            fields: ["photo"],
          },
          (placeResult, status) => {
            if (
              status === google.maps.places.PlacesServiceStatus.OK &&
              placeResult
            ) {
              createLocation(
                Number(groupId),
                Number(eventId),
                locationName,
                address,
                placeResult.photos?.[0].getUrl() || ""
              );
            }
          }
        );
      }
      onClose();
    }
  };

  const onPlacesChanged = () => {
    if (searchBox) {
      const places = searchBox.getPlaces();
      if (places && places.length > 0) {
        setSelectedPlace(places[0]);
      }
    }
  };

  useEffect(() => {
    // force the pac-container z-index to be above the modal
    const style = document.createElement("style");
    style.innerHTML = ".pac-container { z-index: 10000 !important; }";
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={libraries}
      loadingElement={<></>}
    >
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select a Location</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <StandaloneSearchBox
              onLoad={(ref: google.maps.places.SearchBox) => setSearchBox(ref)}
              onPlacesChanged={onPlacesChanged}
            >
              <Input id="search-input" placeholder="Search for a place" />
            </StandaloneSearchBox>
            <GoogleMap
              center={
                selectedPlace
                  ? {
                      lat: selectedPlace.geometry?.location?.lat() || 0,
                      lng: selectedPlace.geometry?.location?.lng() || 0,
                    }
                  : { lat: 0, lng: 0 }
              }
              zoom={15}
              mapContainerStyle={{ height: "400px", width: "100%" }}
            >
              {selectedPlace && (
                <Marker
                  position={{
                    lat: selectedPlace.geometry?.location?.lat() || 0,
                    lng: selectedPlace.geometry?.location?.lng() || 0,
                  }}
                />
              )}
            </GoogleMap>

            <Button
              colorScheme="green"
              onClick={handleCreateLocation}
              mt={4}
              width="100%"
            >
              Confirm Location
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </LoadScript>
  );
}
