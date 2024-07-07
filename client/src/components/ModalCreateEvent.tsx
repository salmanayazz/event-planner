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
  Heading,
  IconButton,
  Tooltip,
  Icon,
  Box,
} from "@chakra-ui/react";
import { useState } from "react";
import StyledInput from "./StyledInput";
import StyledButton from "./StyledButton";
import { useEvents } from "../contexts/events/EventsContext";
import LocationSelector from "./LocationSelector";
import { Location } from "../contexts/locations/LocationsContext";
import { FiInfo, FiTrash } from "react-icons/fi";
import DateTimeSelector from "./DateTimeSelector";

interface ModalInputProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: number;
}

type dateTimeSelectorOptions =
  | "none"
  | "startTime"
  | "endTime"
  | "votingEndTime";

export default function ModalInput({
  isOpen,
  onClose,
  groupId,
}: ModalInputProps) {
  const { createEvent } = useEvents();

  const [name, setName] = useState("");
  const [availabilityEnabled, setAvailabilityEnabled] = useState(false);
  const [startTime, setStartTime] = useState<Date>();
  const [endTime, setEndTime] = useState<Date>();
  const [location, setLocation] = useState<Location | undefined>(undefined);
  const [votingEndTime, setVotingEndTime] = useState<Date>();
  const [isLoading, setIsLoading] = useState(false);

  const [openLocationSelector, setOpenLocationSelector] = useState(false);
  const [openDateTimeSelector, setOpenDateTimeSelector] =
    useState<dateTimeSelectorOptions>("none");

  const handleSubmit = async () => {
    setIsLoading(true);
    const data: any = {
      name: name,
      votingEndTime: votingEndTime?.getTime(),
      location: location,
    };

    if (availabilityEnabled) {
      data["availabilityStartTime"] = startTime?.getTime();
      data["availabilityEndTime"] = endTime?.getTime();
    } else {
      data["startTime"] = startTime?.getTime();
      data["endTime"] = endTime?.getTime();
    }

    await createEvent(groupId, data);
    setIsLoading(false);
    onClose();
    onReset();
  };

  const onReset = () => {
    setName("");
    setAvailabilityEnabled(false);
    setStartTime(undefined);
    setEndTime(undefined);
    setLocation(undefined);
    setVotingEndTime(undefined);
  };

  const handleDateTimeSelectorSubmit = (date: Date) => {
    switch (openDateTimeSelector) {
      case "startTime":
        setStartTime(date);
        break;
      case "endTime":
        setEndTime(date);
        break;
      case "votingEndTime":
        setVotingEndTime(date);
        break;
    }
    setOpenDateTimeSelector("none");
  };

  function formatDate(date: Date): string {
    const hours = date.getHours();
    let minutes = date.getMinutes().toString();

    // add a leading zero to minutes if it's less than 10
    minutes = minutes.length < 2 ? "0" + minutes : minutes;

    return `${date.toLocaleString("default", {
      month: "long",
      day: "2-digit",
      year: "numeric",
    })} at ${hours}:${minutes}`;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <DateTimeSelector
        isOpen={openDateTimeSelector != "none"}
        onClose={() => setOpenDateTimeSelector("none")}
        onSubmit={handleDateTimeSelectorSubmit}
      />

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
            <Heading size="sm" textAlign="left" width="100%">
              {availabilityEnabled
                ? "Availability Selection Time Frame"
                : "Event Time Frame"}
            </Heading>
            <HStack width="100%">
              <Box onClick={() => setOpenDateTimeSelector("startTime")}>
                <StyledInput
                  value={startTime ? formatDate(startTime) : undefined}
                  placeholder="Select a start time"
                  onChange={() => {}}
                />
              </Box>

              <Box onClick={() => setOpenDateTimeSelector("endTime")}>
                <StyledInput
                  value={endTime ? formatDate(endTime) : undefined}
                  placeholder="Select an end time"
                  onChange={() => {}}
                />
              </Box>
            </HStack>
            <HStack
              width="100%"
              justifyContent="space-between"
              alignItems="center"
            >
              <Heading size="sm" textAlign="left" width="100%">
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
                <Text>Location: {location.name}</Text>
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

            {(availabilityEnabled || !location) && (
              <>
                <Heading size="sm" textAlign="left" width="100%">
                  Voting End Time
                </Heading>
                <Box
                  onClick={() => setOpenDateTimeSelector("votingEndTime")}
                  width="100%"
                >
                  <StyledInput
                    value={
                      votingEndTime ? formatDate(votingEndTime) : undefined
                    }
                    placeholder="Select a voting end time"
                    onChange={() => {}}
                  />
                </Box>
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
