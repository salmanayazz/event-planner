import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Flex, useDisclosure, VStack } from "@chakra-ui/react";
import { User, useAuth } from "../contexts/auth/AuthContext";
import { useEvents, Event } from "../contexts/events/EventsContext";
import { useLocations, Location } from "../contexts/locations/LocationsContext";
import LocationCard from "../components/LocationCard";
import LocationSelector from "../components/LocationSelector";
import Header from "../components/Header";
import { FiPlus } from "react-icons/fi";
import EventSidebar from "../components/EventSidebar";

export default function EventLocations() {
  const { user } = useAuth();
  const { groupId, eventId } = useParams();
  const { locations, getLocations, createLocation } = useLocations();
  const { events, getEvents } = useEvents();

  const event = events?.find((event: Event) => event.id === Number(eventId));
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    getEvents(Number(groupId));
    getLocations(Number(groupId), Number(eventId));
  }, [groupId, eventId]);

  const votedLocation: Location | undefined = locations?.find((location) =>
    location?.voters?.some((voter: User) => voter.id === user?.id)
  );

  const suggestedLocation: Location | undefined = locations?.find(
    (location) => location.creator?.id === user?.id
  );

  return (
    <Flex width="100%" height="100%" bg="pri.100">
      <EventSidebar groupId={Number(groupId)} eventId={Number(eventId)} />
      <VStack spacing="0" width="100%">
        <Header
          title={event?.name || ""}
          onButtonClick={onOpen}
          buttonLabel="Suggest Location"
          buttonIcon={FiPlus}
          buttonDisabled={
            votedLocation != undefined || suggestedLocation != undefined
          }
        />

        <VStack spacing="0" width="100%" padding="1rem">
          {locations?.map((location) => (
            <LocationCard
              key={location.id}
              location={location}
              votedLocation={votedLocation}
              suggestedLocation={suggestedLocation}
              groupId={Number(groupId)}
              eventId={Number(eventId)}
            />
          ))}
        </VStack>

        <LocationSelector
          onClose={onClose}
          isOpen={isOpen}
          onSubmit={(location) => {
            createLocation(
              Number(groupId),
              Number(eventId),
              location.name,
              location.address,
              location.photoUrl
            );
            onClose();
          }}
        />
      </VStack>
    </Flex>
  );
}
