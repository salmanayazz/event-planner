import { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Flex,
  ModalFooter,
} from "@chakra-ui/react";
import { GoogleMap, Marker, StandaloneSearchBox } from "@react-google-maps/api";
import { Location } from "../contexts/locations/LocationsContext";
import StyledInput from "./StyledInput";
import StyledButton from "./StyledButton";

interface LocationSelectorProps {
  onClose: () => void;
  isOpen: boolean;
  onSubmit: (location: Location) => void;
}

export default function LocationSelector({
  onClose,
  isOpen,
  onSubmit,
}: LocationSelectorProps) {
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult>();
  const [searchBox, setSearchBox] =
    useState<google.maps.places.SearchBox | null>();

  useEffect(() => {
    console.log("selected place");
    console.log(selectedPlace);
  }, [selectedPlace]);

  const handleCreateLocation = async () => {
    if (selectedPlace) {
      const location: Location = {
        name: selectedPlace.name || "",
        address: selectedPlace.formatted_address || "",
        placeId: selectedPlace.place_id || "",
        photoUrl: selectedPlace.photos?.[0].getUrl() || "",
      };

      if (location.name && location.address && location.placeId) {
        const placesService = new google.maps.places.PlacesService(
          document.createElement("div")
        );

        placesService.getDetails(
          {
            placeId: location.placeId,
            fields: ["photo"],
          },
          (placeResult, status) => {
            if (
              status === google.maps.places.PlacesServiceStatus.OK &&
              placeResult
            ) {
              onSubmit(location);
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
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="pri.200">
        <ModalHeader color="sec.100">Select a Location</ModalHeader>
        <ModalCloseButton color="sec.100" />
        <ModalBody>
          <Flex direction="column" gap="1rem">
            <StandaloneSearchBox
              onLoad={(ref: google.maps.places.SearchBox) => setSearchBox(ref)}
              onPlacesChanged={onPlacesChanged}
            >
              <StyledInput
                id="search-input"
                placeholder="Search for a place"
                onChange={() => {}}
              />
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
              mapContainerStyle={{
                height: "400px",
                width: "100%",
                borderRadius: "2%",
              }}
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
          </Flex>
        </ModalBody>
        <ModalFooter>
          <StyledButton
            onClick={handleCreateLocation}
            isDisabled={!selectedPlace}
          >
            Confirm Location
          </StyledButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
