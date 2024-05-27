import React, { useState } from "react";
import { Box, Button, Input, VStack } from "@chakra-ui/react";
import { useGroups } from "../contexts/groups/GroupsContext";
import Header from "../components/Header";
import { FiCalendar, FiPlus, FiUser } from "react-icons/fi";
import { GROUP_EVENTS_LINK } from "../links";
import Cards from "../components/Cards";

export default function Groups() {
  const { groups, createGroup } = useGroups();
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupName, setGroupName] = useState("");

  const handleCreateGroup = () => {
    setShowCreateGroup(true);
  };

  const handleGroupNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setGroupName(event.target.value);
  };

  const handleConfirmCreateGroup = () => {
    createGroup(groupName);
    setShowCreateGroup(false);
    setGroupName("");
  };

  const handleCancelCreateGroup = () => {
    setShowCreateGroup(false);
    setGroupName("");
  };

  return (
    <Box>
      <Header
        title="Groups"
        onButtonClick={handleCreateGroup}
        buttonLabel="Create Group"
        buttonIcon={FiPlus}
      />

      <Cards
        values={groups.map((group) => {
          return {
            id: group.id,
            name: group.name,
            icons: [
              {
                type: FiCalendar,
                label: group.events.length.toString(),
              },
              {
                type: FiUser,
                label: (group.members.length + 1).toString(), // +1 for the owner
              },
            ],
          };
        })}
        link={(id) => GROUP_EVENTS_LINK(id)}
      />

      {!showCreateGroup ? (
        <Button colorScheme="blue" mt={4} onClick={handleCreateGroup}>
          Create New Group
        </Button>
      ) : (
        <VStack spacing={4} align="start" mt={4}>
          <Input
            placeholder="Enter group name"
            value={groupName}
            onChange={handleGroupNameChange}
          />
          <Button colorScheme="green" onClick={handleConfirmCreateGroup}>
            Confirm
          </Button>
          <Button colorScheme="red" onClick={handleCancelCreateGroup}>
            Cancel
          </Button>
        </VStack>
      )}
    </Box>
  );
}
