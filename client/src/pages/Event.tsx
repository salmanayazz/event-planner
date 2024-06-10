import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Flex } from "@chakra-ui/react";
import { useEvents, Event } from "../contexts/events/EventsContext";
import { useLocations } from "../contexts/locations/LocationsContext";
import Header from "../components/Header";
import { FiCheckCircle } from "react-icons/fi";
import EventSidebar from "../components/EventSidebar";

export default function EventPage() {
  const { groupId, eventId } = useParams();
  const { getLocations } = useLocations();
  const { events, getEvents } = useEvents();

  const event = events?.find((event: Event) => event.id === Number(eventId));

  useEffect(() => {
    getEvents(Number(groupId));
    getLocations(Number(groupId), Number(eventId));
  }, [groupId, eventId]);

  return (
    <Flex width="100%" height="100%" bg="pri.100">
      <EventSidebar groupId={Number(groupId)} eventId={Number(eventId)} />
      <Header
        title={event?.name || ""}
        onButtonClick={() => console.log("Attend event")}
        buttonLabel="Attend Event"
        buttonIcon={FiCheckCircle}
      />
    </Flex>
  );
}
