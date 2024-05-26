import { Grid, HStack, Text, VStack, Box, Divider } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { Group } from "../contexts/groups/GroupsContext";
import { FiCalendar, FiUser } from "react-icons/fi";
import { GROUP_EVENTS_LINK } from "../links";

interface GroupCardProps {
  groups: Group[];
}

export default function GroupCards({ groups }: GroupCardProps) {
  return (
    <Grid
      templateColumns={{
        base: "repeat(1, 1fr)",
        md: "repeat(2, 1fr)",
        lg: "repeat(3, 1fr)",
      }}
      gap={4}
      p={4}
      justifyContent="center"
    >
      {groups.map((group) => (
        <NavLink key={group.id} to={GROUP_EVENTS_LINK(group.id)}>
          <VStack
            bg="pri.200"
            p={4}
            borderRadius="md"
            w="100%"
            align="start"
            spacing="1.5rem"
          >
            <Text fontSize="lg" fontWeight="bold" color="sec.100">
              {group.name}
            </Text>

            <Divider color="sec.200" />

            <HStack spacing="2rem">
              <Box position="relative">
                <FiCalendar size="1.25em" color="white" />
                <Text
                  position="absolute"
                  top="-0.5em"
                  right={`${-2.25}rem`}
                  color="white"
                  bg="pri.400"
                  borderRadius="full"
                  px={2}
                  fontSize="xs"
                  fontWeight="bold"
                >
                  TODO
                </Text>
              </Box>

              <Box position="relative">
                <FiUser size="1.25em" color="white" />
                <Text
                  position="absolute"
                  top="-0.5em"
                  right={`${
                    -1.5 + group.members.length.toString().length * 0.25
                  }rem`}
                  color="white"
                  bg="pri.400"
                  borderRadius="full"
                  px={2}
                  fontSize="xs"
                  fontWeight="bold"
                >
                  {/* Add 1 to include the creator */}
                  {group.members.length + 1}
                </Text>
              </Box>
            </HStack>
          </VStack>
        </NavLink>
      ))}
    </Grid>
  );
}
