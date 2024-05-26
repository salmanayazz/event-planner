import { VStack } from "@chakra-ui/react";
import { useGroups } from "../contexts/groups/GroupsContext";
import { useEvents } from "../contexts/events/EventsContext";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { EVENT_LINK } from "../links";
import { NavLink } from "react-router-dom";
import Header from "../components/Header";
import { FiPlus } from "react-icons/fi";
import ModalInput from "./ModalInput";

export default function Group() {
  const { groups } = useGroups();
  const { events, createEvent } = useEvents();
  const groupId = Number(useParams<{ groupId: string }>().groupId);
  const group = groups.find((group) => group.id === groupId);

  const [newEvent, setNewEvent] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    setIsSubmitting(true);
    await createEvent(groupId, newEvent);
    setIsSubmitting(false);
    setShowInput(false);
    setNewEvent("");
  }

  return (
    <VStack align="start" width="100%">
      <Header
        title={group?.name || ""}
        onButtonClick={() => setShowInput(true)}
        buttonLabel="Create Event"
        buttonIcon={FiPlus}
      />

      <ModalInput
        isOpen={showInput}
        onClose={() => setShowInput(false)}
        header="Create Event"
        placeholder="Enter event name"
        value={newEvent}
        onChange={(event) => setNewEvent(event.target.value)}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />

      <h2>Events:</h2>
      {events?.map((event) => (
        <NavLink to={EVENT_LINK(groupId, event.id)}>
          <h3 key={event.id}>{event.name}</h3>
        </NavLink>
      ))}
    </VStack>
  );
}
