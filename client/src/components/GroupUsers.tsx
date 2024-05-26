import { Button, VStack } from "@chakra-ui/react";
import { useGroups } from "../contexts/groups/GroupsContext";
import { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "./Header";
import { FiPlus } from "react-icons/fi";
import ModalInput from "./ModalInput";

export default function Group() {
  const { groups, addUserToGroup, deleteUserFromGroup } = useGroups();
  const groupId = Number(useParams<{ groupId: string }>().groupId);
  const group = groups.find((group) => group.id === groupId);

  const [newUser, setNewUser] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    setIsSubmitting(true);
    await addUserToGroup(groupId, newUser);
    setIsSubmitting(false);
    setShowInput(false);
    setNewUser("");
  }

  return (
    <VStack align="start" width="100%">
      <Header
        title={group?.name || ""}
        onButtonClick={() => setShowInput(true)}
        buttonLabel="Add Friend"
        buttonIcon={FiPlus}
      />

      <ModalInput
        isOpen={showInput}
        onClose={() => setShowInput(false)}
        header="Add Friend"
        placeholder="Enter username"
        value={newUser}
        onChange={(event) => setNewUser(event.target.value)}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />

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
