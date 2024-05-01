import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGroups, Event, Location } from "../contexts/groups/GroupsContext";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Input,
} from "@chakra-ui/react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  StandaloneSearchBox,
} from "@react-google-maps/api";

export default function EventPage() {
  const { eventId } = useParams();
  const { events, locations, getLocations, createLocation } = useGroups();
  const event = events?.find((event) => event.id === Number(eventId));

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [searchBox, setSearchBox] = useState(null);

  useEffect(() => {
    getLocations(Number(eventId));
  }, [eventId]);

  useEffect(() => {
    // force the pac-container z-index to be above the modal
    const style = document.createElement("style");
    style.innerHTML = ".pac-container { z-index: 10000 !important; }";
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleCreateLocation = () => {
    if (selectedPlace) {
      const locationName = selectedPlace.name;
      const address = selectedPlace.formatted_address;
      // createLocation(Number(eventId), locationName, address);
      onClose();
    }
  };

  const onPlacesChanged = () => {
    setSelectedPlace(searchBox.getPlaces()[0]);
  };

  return (
    <>
      <h1>{event?.name}</h1>
      <h2>Locations:</h2>
      {locations?.map((location) => (
        <div key={location.id}>
          {/* <h4>{location.name}</h4>
          <p>{location.address}</p>
          <img src={location.picture} alt={location.name} /> */}
        </div>
      ))}
      <Button colorScheme="green" onClick={onOpen}>
        Add a Location
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select a Location</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <LoadScript
              googleMapsApiKey="AIzaSyCQuOEDG85kdr2u3HrdWR9qWoa19qHivzU"
              libraries={["places"]}
            >
              <StandaloneSearchBox
                onLoad={(ref) => setSearchBox(ref)}
                onPlacesChanged={onPlacesChanged}
              >
                <Input id="search-input" placeholder="Search for a place" />
              </StandaloneSearchBox>
              <GoogleMap
                center={
                  selectedPlace
                    ? {
                        lat: selectedPlace.geometry.location.lat(),
                        lng: selectedPlace.geometry.location.lng(),
                      }
                    : { lat: 0, lng: 0 }
                }
                zoom={15}
                mapContainerStyle={{ height: "400px", width: "100%" }}
              >
                {selectedPlace && (
                  <Marker
                    position={{
                      lat: selectedPlace.geometry.location.lat(),
                      lng: selectedPlace.geometry.location.lng(),
                    }}
                  />
                )}
              </GoogleMap>
            </LoadScript>
            <Button colorScheme="green" onClick={handleCreateLocation}>
              Confirm Location
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
