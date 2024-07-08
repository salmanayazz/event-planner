import { VStack, HStack, Text, IconButton, Icon, Flex } from "@chakra-ui/react";
import { useGroups } from "../contexts/groups/GroupsContext";
import { useEvents } from "../contexts/events/EventsContext";
import { useAuth } from "../contexts/auth/AuthContext";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { FaCrown } from "react-icons/fa";
import ModalInput from "../components/ModalInput";
import GroupSidebar from "../components/GroupSidebar";

export default function Group() {
  const { groups, addUserToGroup, deleteUserFromGroup } = useGroups();
  const { user } = useAuth();
  const { getEvents } = useEvents();
  const groupId = Number(useParams<{ groupId: string }>().groupId);
  const group = groups.find((group) => group.id === groupId);

  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    getEvents(groupId);
  }, [groupId]);

  async function handleSubmit(user: string) {
    await addUserToGroup(groupId, user);
  }

  return (
    <Flex width="100%" height="100%" bg="pri.100">
      <GroupSidebar groupId={groupId} />
      <VStack width="100%" bg="pri.100">
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
          inputValue={""}
          onSubmit={handleSubmit}
        />

        <VStack width="100%" p="1rem" spacing="1rem">
          <HStack
            width="100%"
            bg="pri.200"
            borderRadius="md"
            paddingX="1rem"
            h="4rem"
          >
            <Icon as={FaCrown} color="sec.100" />
            <Text fontWeight="bold" fontSize="lg">
              {group?.owner.username}
            </Text>
          </HStack>

          {group?.members.map((member) => (
            <HStack
              key={member.id}
              width="100%"
              justifyContent="space-between"
              h="4rem"
              paddingX="1rem"
              bg="pri.200"
              borderRadius="md"
            >
              <Text fontWeight="bold">{member.username}</Text>
              {user?.id === group.owner.id && (
                <IconButton
                  aria-label="Delete member"
                  icon={<FiTrash2 />}
                  onClick={() => deleteUserFromGroup(groupId, member.id)}
                  variant="muted"
                />
              )}
            </HStack>
          ))}
        </VStack>
      </VStack>
    </Flex>
  );
}
