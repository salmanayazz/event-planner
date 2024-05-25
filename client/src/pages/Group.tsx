import { Button, Flex, Input, VStack } from "@chakra-ui/react";
import { useGroups } from "../contexts/groups/GroupsContext";
import { useEvents } from "../contexts/events/EventsContext";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { EVENT_LINK } from "../App";
import { NavLink } from "react-router-dom";
import Header from "../components/Header";
import { FiCalendar, FiPlus, FiUsers } from "react-icons/fi";
import Sidebar from "../components/Sidebar";

export default function Group() {
  const { groups, addUserToGroup, deleteUserFromGroup } = useGroups();
  const { events, getEvents, createEvent } = useEvents();
  const groupId = Number(useParams<{ groupId: string }>().groupId);
  const group = groups.find((group) => group.id === groupId);

  const [newUser, setNewUser] = useState("");
  const [newEvent, setNewEvent] = useState("");
  const [showCreateEvent, setShowCreateEvent] = useState(false);

  useEffect(() => {
    getEvents(groupId);
  }, [groupId]);

  const toggleEventInput = () => {
    setShowCreateEvent(!showCreateEvent);
  };

  return (
    <Flex width="100%">
      <Sidebar
        items={[
          {
            icon: FiCalendar,
            label: "Events",
            onClick: () => {},
            selected: true,
          },
          { icon: FiUsers, label: "Friends", onClick: () => {} },
        ]}
      />
      <VStack align="start" width="100%">
        <Header
          title={group?.name || ""}
          onButtonClick={toggleEventInput}
          buttonLabel="Create Event"
          buttonIcon={FiPlus}
        />

        {showCreateEvent && (
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
                toggleEventInput();
              }}
            >
              Confirm
            </Button>
          </>
        )}

        <h2>Members:</h2>
        <h3>{group?.owner.username}</h3>
        {group?.members.map((user) => (
          <Button
            key={user.id}
            onClick={() => deleteUserFromGroup(groupId, user.id)}
          >
            {user.username}
          </Button>
        ))}

        <h2>Add a friend:</h2>
        <Input
          placeholder="Enter friend's username"
          value={newUser}
          onChange={(event) => setNewUser(event.target.value)}
        />
        <Button
          colorScheme="green"
          onClick={() => addUserToGroup(groupId, newUser)}
        >
          Confirm
        </Button>

        <h2>Events:</h2>
        {events?.map((event) => (
          <NavLink to={EVENT_LINK(groupId, event.id)}>
            <h3 key={event.id}>{event.name}</h3>
          </NavLink>
        ))}
      </VStack>
    </Flex>
  );
}
