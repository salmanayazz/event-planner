import { VStack } from "@chakra-ui/react";
import { useGroups } from "../contexts/groups/GroupsContext";
import { useEvents } from "../contexts/events/EventsContext";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { EVENT_LINK } from "../links";
import Header from "../components/Header";
import { FiMapPin, FiPlus } from "react-icons/fi";
import Cards from "./Cards";
import ModalCreateEvent from "./ModalCreateEvent";

export default function Group() {
  const { groups } = useGroups();
  const { events } = useEvents();
  const groupId = Number(useParams<{ groupId: string }>().groupId);
  const group = groups.find((group) => group.id === groupId);
  const [showInput, setShowInput] = useState(false);

  return (
    <VStack align="start" width="100%" spacing="0">
      <Header
        title={group?.name || ""}
        onButtonClick={() => setShowInput(true)}
        buttonLabel="Create Event"
        buttonIcon={FiPlus}
      />

      <ModalCreateEvent
        isOpen={showInput}
        onClose={() => setShowInput(false)}
        groupId={groupId}
      />

      <Cards
        values={events.map((event) => {
          return {
            id: event.id,
            name: event.name,
            icons: [
              {
                type: FiMapPin,
                label: (event?.locations?.length || 0).toString(),
              },
            ],
          };
        })}
        link={(id) => EVENT_LINK(groupId, id)}
        onDelete={(id) => console.log(id)}
        onEdit={(id) => console.log(id)}
      />
    </VStack>
  );
}
