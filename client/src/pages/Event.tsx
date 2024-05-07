import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  VStack,
  Box,
  Image,
  Text,
  Flex,
} from "@chakra-ui/react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  StandaloneSearchBox,
} from "@react-google-maps/api";
import { useGroups, Event, Location } from "../contexts/groups/GroupsContext";
import { FaMapMarkerAlt } from "react-icons/fa";

export default function Event() {
  const { groupId, eventId } = useParams();
  const { events, locations, getLocations, createLocation } = useGroups();
  const event = events?.find((event: Event) => event.id === Number(eventId));
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult>();
  const [searchBox, setSearchBox] =
    useState<google.maps.places.SearchBox | null>();

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

  return (
    <>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        {event?.name}
      </Text>

      <Text fontSize="lg" fontWeight="bold" mb={4}>
        Locations
      </Text>

      <VStack spacing={4} align="stretch">
        {locations?.map((location: Location) => (
          <Box m={4} borderRadius="md" boxShadow="xl" key={location.id}>
            <Image
              src={location.photoUrl}
              alt={location.name}
              objectFit="cover"
              width="100%"
              height="200px"
              borderTopRadius="md"
            />
            <Box key={location.id} p={4} bg="gray.100">
              <Flex align="center">
                <FaMapMarkerAlt size={24} color="blue.500" />
                <Text ml={2} fontWeight="bold" fontSize="l">
                  {location.name}
                </Text>
              </Flex>
              <Text mt={2}>{location.address}</Text>
              <Text mt={2}>{location.creator.username}</Text>
              <Flex justify="space-between" mt={4}>
                <Button colorScheme="blue" mr={4}>
                  <Text>Vote</Text>
                </Button>
                <Box>
                  {location.voters.map((voter) => (
                    <Text key={voter.id}>{voter.username}</Text>
                  ))}
                </Box>
              </Flex>
            </Box>
          </Box>
        ))}
      </VStack>

      <Button colorScheme="green" onClick={onOpen} mt={4}>
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
            </LoadScript>
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
    </>
  );
}
