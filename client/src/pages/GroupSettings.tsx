import {
  HStack,
  Heading,
  Text,
  Flex,
  VStack,
  IconButton,
} from "@chakra-ui/react";
import ModalInput from "../components/ModalInput";
import { useNavigate, useParams } from "react-router-dom";
import { useGroups } from "../contexts/groups/GroupsContext";
import { useState } from "react";
import ModalConfirmation from "../components/ModalConfirmation";
import Header from "../components/Header";
import GroupSidebar from "../components/GroupSidebar";
import { GROUPS_LINK } from "../links";
import { FiEdit3, FiTrash2 } from "react-icons/fi";

export default function GroupSettings() {
  const { groups, editGroup, deleteGroup } = useGroups();
  const groupId = Number(useParams<{ groupId: string }>().groupId);
  const group = groups.find((group) => group.id === groupId);

  const [openEditName, setOpenEditName] = useState(false);
  const [openDeleteGroup, setOpenDeleteGroup] = useState(false);

  const navigate = useNavigate();

  async function handleEditName(name: string) {
    if (!group) return;
    await editGroup(group.id, name);
  }

  async function handleDeleteGroup() {
    if (!group) return;
    await deleteGroup(group.id);
    navigate(GROUPS_LINK(), { replace: true });
  }

  return (
    <Flex width="100%" height="100%" bg="pri.100">
      <GroupSidebar groupId={groupId} />

      <VStack width="100%" spacing="1rem">
        <Header title={group?.name} />

        <VStack width="100%" spacing="2rem" padding="1rem">
          <HStack
            justifyContent="space-between"
            w="100%"
            bg="pri.200"
            p="1rem"
            borderRadius="md"
          >
            <Heading as="h2">Edit Group Name</Heading>

            <IconButton
              onClick={() => setOpenEditName(true)}
              icon={<FiEdit3 />}
              aria-label={"Edit group name"}
            />
          </HStack>

          <HStack
            justifyContent="space-between"
            alignItems="center"
            w="100%"
            bg="pri.200"
            p="1rem"
            borderRadius="md"
          >
            <VStack alignItems="start">
              <Heading as="h2">Delete Group</Heading>
              <Text fontSize="lg" fontWeight="bold">
                Delete this group and all of its events
              </Text>
            </VStack>
            <IconButton
              onClick={() => setOpenDeleteGroup(true)}
              icon={<FiTrash2 />}
              aria-label={"Delete group"}
            />
          </HStack>
        </VStack>
      </VStack>

      {/* modal for editing group name*/}
      <ModalInput
        isOpen={openEditName}
        onClose={() => {
          setOpenEditName(false);
        }}
        header="Edit Group"
        placeholder="Group Name"
        inputValue={group?.name}
        onSubmit={handleEditName}
      />

      {/* modal for deleting group */}
      <ModalConfirmation
        isOpen={openDeleteGroup}
        onClose={() => setOpenDeleteGroup(false)}
        header={`Delete "${group?.name}"?`}
        onConfirm={handleDeleteGroup}
      />
    </Flex>
  );
}
