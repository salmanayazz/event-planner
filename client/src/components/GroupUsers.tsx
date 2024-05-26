import { Button, Input, VStack } from "@chakra-ui/react";
import { useGroups } from "../contexts/groups/GroupsContext";
import { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "./Header";
import { FiPlus } from "react-icons/fi";

export default function Group() {
  const { groups, addUserToGroup, deleteUserFromGroup } = useGroups();
  const groupId = Number(useParams<{ groupId: string }>().groupId);
  const group = groups.find((group) => group.id === groupId);

  const [newUser, setNewUser] = useState("");
  const [showInput, setShowInput] = useState(false);

  const toggleInput = () => {
    setShowInput(!showInput);
  };

  return (
    <VStack align="start" width="100%">
      <Header
        title={group?.name || ""}
        onButtonClick={toggleInput}
        buttonLabel="Add Friend"
        buttonIcon={FiPlus}
      />

      {showInput && (
        <>
          <Input
            placeholder="Enter username"
            value={newUser}
            onChange={(event) => setNewUser(event.target.value)}
          />
          <Button
            colorScheme="green"
            onClick={() => {
              addUserToGroup(groupId, newUser);
              toggleInput();
            }}
          >
            Confirm
          </Button>
        </>
      )}

      <h3>{group?.owner.username}</h3>
      {group?.members.map((user) => (
        <Button
          key={user.id}
          onClick={() => deleteUserFromGroup(groupId, user.id)}
        >
          {user.username}
        </Button>
      ))}
    </VStack>
  );
}
