import {
  Box,
  Button,
  Grid,
  HStack,
  Heading,
  IconButton,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface CalendarItem {
  date?: Date;
  selected?: boolean;
}

interface DateTimeSelectorProps {
  onClose: () => void;
  isOpen: boolean;
  onSubmit: (location: Location) => void;
}

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function DateTimeSelector({
  onClose,
  isOpen,
  onSubmit,
}: DateTimeSelectorProps) {
  const [date, setDate] = useState<Date | undefined>();
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [calendar, setCalendar] = useState<CalendarItem[]>([]);

  useEffect(() => {
    const tempDate = new Date(year, month, 1);
    const tempCalendar: CalendarItem[] = [];

    for (let i = 0; i < tempDate.getDay(); i++) {
      tempCalendar.push({ date: undefined });
    }

    while (tempDate.getMonth() === month) {
      tempCalendar.push({ date: new Date(tempDate.getTime()) });
      tempDate.setDate(tempDate.getDate() + 1);
    }

    setCalendar(tempCalendar);
  }, [month, year]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg="pri.200">
        <ModalHeader color="sec.100">Select a Date and Time</ModalHeader>
        <ModalCloseButton color="sec.100" />
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
              icon={<FiChevronLeft size="1.5rem" />}
              color="sec.100"
              bg="pri.300"
              size="md"
              _hover={{ bg: "pri.100" }}
            />

            <Heading size="sm" color="sec.100">
              {new Date(
                calendar[calendar.length - 1]?.date ?? 0
              ).toLocaleString("default", {
                month: "long",
              })}
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
              icon={<FiChevronRight size="1.5rem" />}
              color="sec.100"
              bg="pri.300"
              size="md"
              _hover={{ bg: "pri.100" }}
            />
          </HStack>

          <Grid templateColumns="repeat(7, 1fr)" width="100%" gap="0.25rem">
            {days.map((day) => (
              <Heading color="sec.200" size="sm" textAlign="center">
                {day}
              </Heading>
            ))}
            {calendar.map((calendarItem) =>
              calendarItem.date ? (
                <Button
                  bg="pri.300"
                  color="sec.200"
                  _hover={{ bg: "pri.100", color: "sec.100" }}
                  _active={{ bg: "sec.200", color: "pri.100" }}
                  isActive={date == calendarItem.date}
                  onClick={() => {
                    setDate(calendarItem.date);
                  }}
                >
                  {calendarItem.date?.getDate()}
                </Button>
              ) : (
                <Box />
              )
            )}
          </Grid>
        </VStack>
      </ModalContent>
    </Modal>
  );
}
