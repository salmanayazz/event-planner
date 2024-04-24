import React, { useEffect, useState } from "react";
import { Box, Button, Input, Text, VStack } from "@chakra-ui/react";
import { useGroups } from "../contexts/groups/GroupsContext";

const Groups: React.FC = () => {
  const { groups, getGroups, createGroup } = useGroups();
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupName, setGroupName] = useState("");

  useEffect(() => {
    getGroups();
  }, []);

  const handleCreateGroup = () => {
    setShowCreateGroup(true);
  };

  const handleGroupNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setGroupName(event.target.value);
  };

  const handleConfirmCreateGroup = () => {
    // Add logic to create a new group with the given name
    createGroup(groupName);
    setShowCreateGroup(false);
    setGroupName("");
  };

  const handleCancelCreateGroup = () => {
    setShowCreateGroup(false);
    setGroupName("");
  };

  return (
    <Box p={4}>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        My Groups
      </Text>

      <VStack spacing={4} align="start">
        {groups.map((group) => (
          <Text key={group.id}>{group.name}</Text>
        ))}
      </VStack>

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
};

export default Groups;
