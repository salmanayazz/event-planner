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
  const { groupId, eventId } = useParams();
  const { events, locations, getLocations, createLocation } = useGroups();
  const event = events?.find((event: Event) => event.id === Number(eventId));

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult>();
  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox>();

  useEffect(() => {
    getLocations(Number(groupId), Number(eventId));
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

      if (locationName && address) {
        createLocation(Number(groupId), Number(eventId), locationName, address);
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

  return (
    <>
      <h1>{event?.name}</h1>
      <h2>Locations:</h2>
      {console.log(locations)}
      {locations?.map((location: Location) => (
        <div key={location.id}>
          <h4>{location.name}</h4>
          <p>{location.address}</p>
          {/* <img src={location.picture} alt={location.name} /> */}
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
              googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
              libraries={["places"]}
            >
              <StandaloneSearchBox
                onLoad={(ref: google.maps.places.SearchBox) =>
                  setSearchBox(ref)
                }
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
