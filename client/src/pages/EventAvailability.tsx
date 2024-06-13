import { Flex } from "@chakra-ui/react";
import EventSidebar from "../components/EventSidebar";
import { useParams } from "react-router-dom";
import TimeSelector from "../components/TimeSelector";

export default function EventAvailability() {
  const { groupId, eventId } = useParams();

  return (
    <Flex width="100%" height="100%" bg="pri.100">
      <EventSidebar groupId={Number(groupId)} eventId={Number(eventId)} />
      <TimeSelector
        start={new Date().getTime() + 1000 * 60 * 60 * 2} // 2 hours from now
        end={
          new Date().getTime() + 1000 * 60 * 60 * 24 * 1 + 1000 * 60 * 60 * 12
        } // 1 day from now + 12 hours
        onSubmit={(enabledTimes) => console.log(enabledTimes)}
      />
    </Flex>
  );
}
