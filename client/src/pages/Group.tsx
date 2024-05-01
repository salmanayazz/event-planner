import { Button, Input, VStack } from "@chakra-ui/react";
import { useGroups } from "../contexts/groups/GroupsContext";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { EVENT } from "../App";
import { NavLink } from "react-router-dom";

export default function Group() {
  const {
    groups,
    addUserToGroup,
    deleteUserFromGroup,
    events,
    getEvents,
    createEvent,
  } = useGroups();
  const groupId = Number(useParams<{ groupId: string }>().groupId);
  const group = groups.find((group) => group.id === groupId);

  const [newUser, setNewUser] = useState("");
  const [newEvent, setNewEvent] = useState("");

  useEffect(() => {
    getEvents(groupId);
  }, [groupId]);

  return (
    <VStack spacing={4} align="start" mt={4}>
      <h1>{group?.name}</h1>
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
        <NavLink to={EVENT(groupId, event.id)}>
          <h3 key={event.id}>{event.name}</h3>
        </NavLink>
      ))}

      <h2>Create an Event:</h2>
      <Input
        placeholder="Enter event name"
        value={newEvent}
        onChange={(event) => setNewEvent(event.target.value)}
      />
      <Button onClick={() => createEvent(groupId, newEvent)}>
        Create Event
      </Button>
    </VStack>
  );
}
