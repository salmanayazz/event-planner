import { Button, Input, VStack } from "@chakra-ui/react";
import { useGroups } from "../contexts/groups/GroupsContext";
import { useEvents } from "../contexts/events/EventsContext";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { EVENT_LINK } from "../links";
import { NavLink } from "react-router-dom";
import Header from "../components/Header";
import { FiPlus } from "react-icons/fi";

export default function Group() {
  const { groups } = useGroups();
  const { events, createEvent } = useEvents();
  const groupId = Number(useParams<{ groupId: string }>().groupId);
  const group = groups.find((group) => group.id === groupId);

  const [newEvent, setNewEvent] = useState("");
  const [showInput, setShowInput] = useState(false);

  const toggleInput = () => {
    setShowInput(!showInput);
  };

  return (
    <VStack align="start" width="100%">
      <Header
        title={group?.name || ""}
        onButtonClick={toggleInput}
        buttonLabel="Create Event"
        buttonIcon={FiPlus}
      />

      {showInput && (
        <>
          <Input
            placeholder="Enter event name"
            value={newEvent}
            onChange={(event) => setNewEvent(event.target.value)}
          />
          <Button
            colorScheme="green"
            onClick={() => {
              createEvent(groupId, newEvent);
              toggleInput();
            }}
          >
            Confirm
          </Button>
        </>
      )}

      <h2>Events:</h2>
      {events?.map((event) => (
        <NavLink to={EVENT_LINK(groupId, event.id)}>
          <h3 key={event.id}>{event.name}</h3>
        </NavLink>
      ))}
    </VStack>
  );
}
