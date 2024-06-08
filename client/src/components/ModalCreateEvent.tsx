import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
  HStack,
  Checkbox,
  Text,
  Input,
  Heading,
  IconButton,
  Tooltip,
  Icon,
} from "@chakra-ui/react";
import { useState } from "react";
import StyledInput from "./StyledInput";
import StyledButton from "./StyledButton";
import { useEvents } from "../contexts/events/EventsContext";
import LocationSelector from "./LocationSelector";
import { Location } from "../contexts/locations/LocationsContext";
import { FiInfo, FiTrash } from "react-icons/fi";

interface ModalInputProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: number;
}

export default function ModalInput({
  isOpen,
  onClose,
  groupId,
}: ModalInputProps) {
  const { createEvent } = useEvents();

  const [name, setName] = useState("");
  const [availabilityEnabled, setAvailabilityEnabled] = useState(false);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [location, setLocation] = useState<Location | undefined>(undefined);
  const [votingEndTime, setVotingEndTime] = useState<string>("");
  const [openLocationSelector, setOpenLocationSelector] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    const data: any = {
      name: name,
      votingEndTime: new Date(votingEndTime).getTime(),
      location: location,
    };

    if (availabilityEnabled) {
      data["availabilityStartTime"] = new Date(startTime).getTime();
      data["availabilityEndTime"] = new Date(endTime).getTime();
    } else {
      data["startTime"] = new Date(startTime).getTime();
      data["endTime"] = new Date(endTime).getTime();
    }

    await createEvent(groupId, data);
    setIsLoading(false);
    onClose();
    onReset();
  };

  const onReset = () => {
    setName("");
    setAvailabilityEnabled(false);
    setStartTime("");
    setEndTime("");
    setLocation(undefined);
    setVotingEndTime("");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent backgroundColor="pri.200">
        <ModalHeader color="sec.100">Create Event</ModalHeader>
        <ModalCloseButton color="sec.100" />
        <ModalBody>
          <VStack spacing="1rem" color="sec.100" alignItems="start">
            <StyledInput
              placeholder="Event Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Checkbox
              isChecked={availabilityEnabled}
              onChange={() => setAvailabilityEnabled(!availabilityEnabled)}
            >
              Allow attendees to select availability
            </Checkbox>
            <Heading size="sm" color="sec.100" textAlign="left" width="100%">
              {availabilityEnabled
                ? "Availability Selection Time Frame"
                : "Event Time Frame"}
            </Heading>
            <HStack width="100%">
              <Input
                value={startTime?.toString() || ""}
                onChange={(e) => setStartTime(e.target.value)}
                type="datetime-local"
              />
              <Input
                value={endTime?.toString() || ""}
                onChange={(e) => setEndTime(e.target.value)}
                type="datetime-local"
              />
            </HStack>
            <HStack
              width="100%"
              justifyContent="space-between"
              alignItems="center"
            >
              <Heading size="sm" color="sec.100" textAlign="left" width="100%">
                Location
              </Heading>
              <Tooltip
                bg="sec.100"
                color="pri.100"
                label="Not selecting a location will allow attendees to vote on a location"
                placement="bottom-end"
                hasArrow
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon
                    as={FiInfo}
                    color="sec.100"
                    width="1.2rem"
                    height="1.2rem"
                  />
                </span>
              </Tooltip>
            </HStack>

            {location ? (
              <HStack
                width="100%"
                border="1px solid"
                borderColor="sec.100"
                justifyContent="space-between"
                px="1rem"
                borderRadius="md"
              >
                <Text color="sec.100">Location: {location.name}</Text>
                <IconButton
                  onClick={() => setLocation(undefined)}
                  aria-label="Remove Location"
                  icon={<FiTrash />}
                  bg="transparent"
                  color="sec.100"
                  _hover={{ bg: "transparent" }}
                />
              </HStack>
            ) : (
              <StyledButton
                onClick={() => setOpenLocationSelector(true)}
                children="Set Location"
                width="full"
              />
            )}

            <LocationSelector
              isOpen={openLocationSelector}
              onClose={() => setOpenLocationSelector(false)}
              onSubmit={(location) => {
                setLocation(location);
                setOpenLocationSelector(false);
              }}
            />

            {(availabilityEnabled || location) && (
              <>
                <Heading
                  size="sm"
                  color="sec.100"
                  textAlign="left"
                  width="100%"
                >
                  Voting End Time
                </Heading>
                <Input
                  value={votingEndTime?.toString() || ""}
                  onChange={(e) => setVotingEndTime(e.target.value)}
                  type="datetime-local"
                />
              </>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <StyledButton
            onClick={handleSubmit}
            isLoading={isLoading}
            children={"Confirm"}
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
