import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button, useDisclosure, VStack, Text } from "@chakra-ui/react";
import { User, useAuth } from "../contexts/auth/AuthContext";
import { useEvents, Event } from "../contexts/events/EventsContext";
import { useLocations, Location } from "../contexts/locations/LocationsContext";
import LocationCard from "../components/LocationCard";
import LocationSelector from "../components/LocationSelector";

export default function EventPage() {
  const { user } = useAuth();
  const { groupId, eventId } = useParams();
  const { locations, getLocations } = useLocations();
  const { events, getEvents } = useEvents();

  const event = events?.find((event: Event) => event.id === Number(eventId));
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    getEvents(Number(groupId));
    getLocations(Number(groupId), Number(eventId));
  }, [groupId, eventId]);

  const votedLocation: Location | undefined = locations?.find((location) =>
    location.voters.some((voter: User) => voter.id === user?.id)
  );

  const suggestedLocation: Location | undefined = locations?.find(
    (location) => location.creator.id === user?.id
  );

  return (
    <>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        {event?.name}
      </Text>
      <Text fontSize="lg" fontWeight="bold" mb={4}>
        Locations
      </Text>

      <VStack spacing={4} align="stretch">
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

      {!suggestedLocation && (
        <Button colorScheme="green" onClick={onOpen} mt={4}>
          Add a Location
        </Button>
      )}

      <LocationSelector
        groupId={Number(groupId)}
        eventId={Number(eventId)}
        onClose={onClose}
        isOpen={isOpen}
      />
    </>
  );
}
