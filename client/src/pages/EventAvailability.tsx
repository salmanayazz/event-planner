import { Flex } from "@chakra-ui/react";
import EventSidebar from "../components/EventSidebar";
import { useParams } from "react-router-dom";
import TimeSelector from "../components/TimeSelector";
import { useEvents } from "../contexts/events/EventsContext";
import { useEffect } from "react";

export default function EventAvailability() {
  const { groupId, eventId } = useParams();
  const { events, getEvents, createAvailability, deleteAvailability } =
    useEvents();
  const event = events?.find((event) => event.id === Number(eventId));

  useEffect(() => {
    getEvents(Number(groupId));
  }, []);

  return (
    <Flex width="100%" height="100%" bg="pri.100">
      <EventSidebar groupId={Number(groupId)} eventId={Number(eventId)} />
      {event && (
        <TimeSelector
          event={event}
          start={event?.availabilityStartTime || 0}
          end={event?.availabilityEndTime || 0}
          onCreate={(time) =>
            createAvailability(Number(groupId), Number(eventId), time)
          }
          onDelete={(time) =>
            deleteAvailability(Number(groupId), Number(eventId), time)
          }
        />
      )}
    </Flex>
  );
}
