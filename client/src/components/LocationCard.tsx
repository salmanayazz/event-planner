import {
  Box,
  Image,
  Text,
  Flex,
  Button,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { Location, useLocations } from "../contexts/locations/LocationsContext";
import { FiMapPin } from "react-icons/fi";

interface LocationCardProps {
  location: Location;
  votedLocation?: Location;
  suggestedLocation?: Location;
  groupId: number;
  eventId: number;
}

export default function LocationCard({
  location,
  votedLocation,
  suggestedLocation,
  groupId,
  eventId,
}: LocationCardProps) {
  const { castVote, deleteVote } = useLocations();

  return (
    <Box m={4} borderRadius="md" key={location.id} width="100%">
      <Image
        src={location.photoUrl}
        alt={location.name}
        objectFit="cover"
        width="100%"
        height="12rem"
        borderTopRadius="lg"
      />
      <HStack justify="space-between" bg="pri.200" p="1rem">
        <VStack
          key={location.id}
          spacing="1rem"
          align="start"
          borderBottomRadius="lg"
        >
          <Flex gap="0.5rem" align="center">
            <FiMapPin size="1.25rem" color="white" />
            <Text fontWeight="bold" fontSize="l">
              {location.name}
            </Text>
          </Flex>
          <Text>{location.address}</Text>
          <Text>{location.creator?.username}</Text>
          <Flex justify="space-between"></Flex>
        </VStack>
        <Button
          onClick={() => {
            if (location.id && votedLocation?.id === location.id) {
              deleteVote(groupId, eventId, location.id);
            } else if (location.id) {
              castVote(groupId, eventId, location.id);
            }
          }}
          // disable button if user has voted for another location or has been suggested
          isDisabled={
            (votedLocation || suggestedLocation) &&
            votedLocation?.id !== location.id
              ? true
              : false
          }
          backgroundColor="sec.100"
          color="pri.100"
          // onClick={onSubmit}
          // isLoading={isLoading}
          _hover={{ backgroundColor: "sec.200" }}
          _active={{ backgroundColor: "sec.300" }}
        >
          {votedLocation?.id === location.id ? "Remove Vote" : "Vote"}
        </Button>
      </HStack>
    </Box>
  );
}
