import React, { useState } from "react";
import { Box } from "@chakra-ui/react";
import { useGroups } from "../contexts/groups/GroupsContext";
import Header from "../components/Header";
import { FiCalendar, FiPlus, FiUser } from "react-icons/fi";
import { GROUP_EVENTS_LINK } from "../links";
import Cards from "../components/Cards";
import ModalInput from "../components/ModalInput";

export default function Groups() {
  const { groups, createGroup } = useGroups();
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  const handleCreateGroup = async (groupName: string) => {
    await createGroup(groupName);
  };

  return (
    <Box>
      <Header
        title="Groups"
        onButtonClick={() => setShowCreateGroup(true)}
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

      <ModalInput
        isOpen={showCreateGroup}
        onClose={() => {
          setShowCreateGroup(false);
        }}
        header="Create Group"
        placeholder="Enter group name"
        inputValue={""}
        onSubmit={handleCreateGroup}
      />
    </Box>
  );
}
