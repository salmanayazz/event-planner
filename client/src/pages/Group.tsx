import { Button, Input, VStack } from "@chakra-ui/react";
import { useGroups } from "../contexts/groups/GroupsContext";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/auth/AuthContext";

export default function Group() {
  const { groups, addUserToGroup } = useGroups();
  const { authState } = useAuth();
  const groupId = Number(useParams<{ groupId: string }>().groupId);
  const group = groups.find((group) => group.id === groupId);
  const [newUser, setNewUser] = useState("");

  return (
    <VStack spacing={4} align="start" mt={4}>
      <h1>{group?.name}</h1>
      <h2>Members:</h2>
      {group?.members.map((username) => (
        <p key={username}>{username}</p>
      ))}

      {group?.owner.username === authState.user?.username && (
        <>
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
        </>
      )}
    </VStack>
  );
}
