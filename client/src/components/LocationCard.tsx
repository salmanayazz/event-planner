import { Box, Image, Text, Flex, Button } from "@chakra-ui/react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { Location, useLocations } from "../contexts/locations/LocationsContext";

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
    <Box m={4} borderRadius="md" boxShadow="xl" key={location.id}>
      <Image
        src={location.photoUrl}
        alt={location.name}
        objectFit="cover"
        width="100%"
        height="200px"
        borderTopRadius="md"
      />
      <Box key={location.id} p={4} bg="gray.100">
        <Flex align="center">
          <FaMapMarkerAlt size={24} color="blue.500" />
          <Text ml={2} fontWeight="bold" fontSize="l">
            {location.name}
          </Text>
        </Flex>
        <Text mt={2}>{location.address}</Text>
        <Text mt={2}>{location.creator.username}</Text>
        <Flex justify="space-between" mt={4}>
          {/* only show the vote button if the user hasn't voted or suggested a location */}
          {!votedLocation && !suggestedLocation ? (
            <Button
              colorScheme="blue"
              mr={4}
              onClick={() => castVote(groupId, eventId, location.id)}
            >
              <Text>Vote</Text>
            </Button>
          ) : (
            votedLocation?.id === location.id && (
              <Button
                colorScheme="red"
                mr={4}
                onClick={() =>
                  deleteVote(Number(groupId), Number(eventId), location.id)
                }
              >
                <Text>Remove Vote</Text>
              </Button>
            )
          )}

          <Box>
            {location.voters.map((voter) => (
              <Text key={voter.id}>{voter.username}</Text>
            ))}
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}
