import {
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  Heading,
  Icon,
  IconButton,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiChevronUp,
} from "react-icons/fi";

interface DateTimeSelectorProps {
  onClose: () => void;
  isOpen: boolean;
  onSubmit: (date: Date) => void;
}

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function DateTimeSelector({
  onClose,
  isOpen,
  onSubmit,
}: DateTimeSelectorProps) {
  const [date, setDate] = useState<Date>(new Date(0, 0));
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [calendar, setCalendar] = useState<(Date | undefined)[]>([]);
  const [hasSelected, setHasSelected] = useState(false);

  useEffect(() => {
    const tempDate = new Date(year, month, 1);
    const tempCalendar: (Date | undefined)[] = [];

    for (let i = 0; i < tempDate.getDay(); i++) {
      tempCalendar.push(undefined);
    }

    while (tempDate.getMonth() === month) {
      tempCalendar.push(new Date(tempDate.getTime()));
      tempDate.setDate(tempDate.getDate() + 1);
    }

    setCalendar(tempCalendar);
  }, [month, year]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select Time</ModalHeader>
        <ModalCloseButton />
        <VStack width="100%" padding="1.5rem">
          <HStack width="100%" justifyContent="space-between">
            <IconButton
              aria-label="Decrease Month"
              onClick={() => {
                if (month == 0) {
                  setYear(year - 1);
                  setMonth(11);
                } else {
                  setMonth(month - 1);
                }
              }}
              icon={<FiChevronLeft />}
              variant="muted"
            />

            <Heading size="sm">
              {new Date(calendar[calendar.length - 1] ?? 0).toLocaleString(
                "default",
                {
                  month: "long",
                }
              )}
              , {year}
            </Heading>

            <IconButton
              aria-label="Increment Month"
              onClick={() => {
                if (month == 11) {
                  setYear(year + 1);
                  setMonth(0);
                } else {
                  setMonth(month + 1);
                }
              }}
              icon={<FiChevronRight />}
              variant="muted"
            />
          </HStack>

          <Grid
            templateColumns="repeat(7, 1fr)"
            templateRows="repeat(7, 1fr)"
            width="100%"
            gap="0.25rem"
          >
            {days.map((day) => (
              <Heading color="sec.200" size="sm" textAlign="center" key={day}>
                {day}
              </Heading>
            ))}

            {calendar.map((calendarDate, i) =>
              calendarDate ? (
                <Button
                  bg="pri.300"
                  color="sec.200"
                  _hover={{ bg: "pri.100", color: "sec.100" }}
                  _active={{ bg: "sec.200", color: "pri.100" }}
                  isActive={
                    date.getFullYear() == calendarDate.getFullYear() &&
                    date.getMonth() == calendarDate.getMonth() &&
                    date.getDate() == calendarDate.getDate()
                  }
                  onClick={() => {
                    const tempDate = new Date(calendarDate.getTime());
                    tempDate.setHours(date.getHours());
                    tempDate.setMinutes(date.getMinutes());
                    setDate(tempDate);
                    setHasSelected(true);
                  }}
                  key={calendarDate.getTime()}
                >
                  {calendarDate.getDate()}
                </Button>
              ) : (
                <Box key={i} />
              )
            )}
          </Grid>

          <HStack justifyContent="center" gap="1.5rem" width="100%">
            <VStack>
              <Icon
                onClick={() => {
                  const tempDate = new Date(date.getTime());
                  if (date.getHours() == 23) {
                    tempDate.setHours(0);
                  } else {
                    tempDate.setHours(tempDate.getHours() + 1);
                  }
                  setDate(tempDate);
                }}
                as={FiChevronUp}
                color="sec.100"
                boxSize="8"
              />

              <Flex
                width="6rem"
                bg="pri.300"
                borderRadius="md"
                justifyContent="center"
                py="0.25rem"
              >
                <Heading size="lg">{date.getHours()}</Heading>
              </Flex>

              <Icon
                onClick={() => {
                  const tempDate = new Date(date.getTime());
                  if (date.getHours() == 0) {
                    tempDate.setHours(23);
                  } else {
                    tempDate.setHours(tempDate.getHours() - 1);
                  }
                  setDate(tempDate);
                }}
                as={FiChevronDown}
                color="sec.100"
                boxSize="8"
              />
            </VStack>

            <Heading size="lg">:</Heading>

            <VStack>
              <Icon
                onClick={() => {
                  const tempDate = new Date(date.getTime());
                  if (date.getMinutes() == 45) {
                    tempDate.setMinutes(0);
                  } else {
                    tempDate.setMinutes(tempDate.getMinutes() + 15);
                  }
                  setDate(tempDate);
                }}
                as={FiChevronUp}
                color="sec.100"
                boxSize="8"
              />

              <Flex
                width="6rem"
                bg="pri.300"
                borderRadius="md"
                justifyContent="center"
                py="0.25rem"
              >
                <Heading size="lg">{date.getMinutes()}</Heading>
              </Flex>

              <Icon
                onClick={() => {
                  const tempDate = new Date(date.getTime());
                  if (date.getMinutes() == 0) {
                    tempDate.setMinutes(45);
                  } else {
                    tempDate.setMinutes(tempDate.getMinutes() - 15);
                  }
                  setDate(tempDate);
                }}
                as={FiChevronDown}
                color="sec.100"
                boxSize="8"
              />
            </VStack>
          </HStack>
          <HStack justifyContent="end" width="100%">
            <Button onClick={() => onSubmit(date)} isDisabled={!hasSelected}>
              Confirm
            </Button>
          </HStack>
        </VStack>
      </ModalContent>
    </Modal>
  );
}
