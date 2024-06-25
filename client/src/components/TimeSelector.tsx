import {
  Button,
  Heading,
  Box,
  HStack,
  VStack,
  Icon,
  IconButton,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Availability, Event } from "../contexts/events/EventsContext";
import { useAuth } from "../contexts/auth/AuthContext";
import StyledButton from "./StyledButton";
import {
  FiArrowLeft,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiChevronUp,
} from "react-icons/fi";

interface TimeSelectorProps {
  event: Event;
  start: number;
  end: number;
  onCreate: (time: number) => void;
  onDelete: (time: number) => void;
}

type Status = "selected" | "not selected" | "disabled";

interface TimeSlot {
  time: number;
  status: Status;
}

interface DateSlot {
  date: number;
  timeSlots: TimeSlot[];
}

export default function TimeSelector({
  event,
  start,
  end,
  onCreate,
  onDelete,
}: TimeSelectorProps) {
  const [dates, setDates] = useState<DateSlot[]>([]);
  const [horizontalDatesIndex, setHorizontalDatesIndex] = useState(0);
  const [horizontalDateWindow, setHorizontalDateWindow] = useState(1);
  const [verticalDatesIndex, setVerticalDatesIndex] = useState(0);
  const [verticalDateWindow, setVerticalDateWindow] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      setHorizontalDateWindow(Math.exp(window.innerWidth / 550));

      if (window.innerHeight > 800) {
        setVerticalDateWindow(12 * 4);
      } else {
        setVerticalDateWindow(8 * 4);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    // place availabilities in a hash map
    const availabilities = event.availabilities?.reduce((acc, availability) => {
      acc[availability.time] = availability;
      return acc;
    }, {} as Record<number, Availability>);

    const tempDates: DateSlot[] = [];
    const startDate = new Date(start);
    const endDate = new Date(end);

    const currentDate = new Date(startDate);

    // iterate through each day and create a time slot for each 15-minute interval
    while (currentDate.getDate() <= endDate.getDate()) {
      const date = new Date(currentDate);
      const timeSlots: TimeSlot[] = [];

      for (let i = 0; i < 24 * 4; i++) {
        const time = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate(),
          Math.floor(i / 4),
          (i % 4) * 15
        );
        timeSlots.push({
          time: time.getTime(),
          // if time for this slot is before start or after end time, disable it
          status:
            time < new Date(event.availabilityStartTime) ||
            time >= new Date(event.availabilityEndTime)
              ? "disabled"
              : availabilities?.[time.getTime()]?.users.find(
                  (u) => u.id === user?.id
                )
              ? "selected"
              : "not selected",
        });
      }

      tempDates.push({ date: date.getTime(), timeSlots });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    setDates(tempDates);
  }, []);

  const handleClick = (i: number, j: number) => {
    // if the time slot is selected, delete it
    if (dates[i].timeSlots[j].status === "selected") {
      onDelete(dates[i].timeSlots[j].time);
    } else if (dates[i].timeSlots[j].status === "not selected") {
      onCreate(dates[i].timeSlots[j].time);
    }

    // immediately update the UI
    const newDates = [...dates];
    newDates[i].timeSlots[j].status =
      dates[i].timeSlots[j].status === "selected" ? "not selected" : "selected";

    setDates(newDates as DateSlot[]);
  };

  return (
    <VStack justifyContent="center" alignItems="center" width="100%">
      <IconButton
        aria-label="Calendar Up"
        onClick={() =>
          setVerticalDatesIndex(verticalDatesIndex - verticalDateWindow)
        }
        visibility={verticalDatesIndex !== 0 ? undefined : "hidden"}
        icon={<FiChevronUp size="1.5rem" />}
        color="sec.100"
        bg="pri.200"
        size="md"
        _hover={{ bg: "pri.300" }}
      />

      <HStack alignItems="end">
        <IconButton
          aria-label="Calendar Left"
          onClick={() =>
            setHorizontalDatesIndex(horizontalDatesIndex - horizontalDateWindow)
          }
          visibility={horizontalDatesIndex > 0 ? undefined : "hidden"}
          margin="auto"
          icon={<FiChevronLeft size="1.5rem" />}
          color="sec.100"
          bg="pri.200"
          size="md"
          _hover={{ bg: "pri.300" }}
        />

        <VStack width="3rem" height="100%" justifyContent="end" spacing="0">
          {dates[0]?.timeSlots.map(
            (timeSlot, i) =>
              i % 4 === 0 && // show the label only for each hour
              i >= verticalDatesIndex &&
              i < verticalDatesIndex + 1 + verticalDateWindow && (
                <Box height="2.8rem" justifyContent="start">
                  <Heading size="sm" color="sec.100" key={`time: ${i}`}>
                    {new Date(timeSlot.time).getHours()}:00
                  </Heading>
                </Box>
              )
          )}
        </VStack>

        {dates.map(
          (dateSlot, i) =>
            i >= horizontalDatesIndex &&
            i < horizontalDatesIndex + horizontalDateWindow && (
              <VStack key={`dateSlot: ${i}`} spacing="0">
                <VStack spacing="0.5rem" justifyContent="end" mb="0.5rem">
                  {(i === horizontalDatesIndex ||
                    (new Date(dateSlot.date).getMonth() === 0 &&
                      new Date(dateSlot.date).getDate() === 1)) && (
                    <Heading size="sm" color="sec.100">
                      {new Date(dateSlot.date).getFullYear()}
                    </Heading>
                  )}

                  {(i === horizontalDatesIndex ||
                    new Date(dateSlot.date).getDate() === 1) && (
                    <Heading size="sm" color="sec.100">
                      {new Date(dateSlot.date).toLocaleString("default", {
                        month: "short",
                      })}
                    </Heading>
                  )}

                  <Heading size="sm" color="sec.100">
                    {new Date(dateSlot.date).getDate()}
                  </Heading>

                  <Heading size="sm" color="sec.100">
                    {
                      ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
                        new Date(dateSlot.date).getDay()
                      ]
                    }
                  </Heading>
                </VStack>

                {dateSlot.timeSlots.map(
                  (timeSlot, j) =>
                    j >= verticalDatesIndex &&
                    j < verticalDatesIndex + verticalDateWindow && (
                      <Button
                        key={`timeSlot: ${j}`}
                        height="0.6rem"
                        width="3rem"
                        bg={
                          timeSlot.status === "selected"
                            ? "green"
                            : timeSlot.status === "not selected"
                            ? "sec.100"
                            : "red"
                        }
                        onClick={() => {
                          handleClick(i, j);
                        }}
                        isDisabled={timeSlot.status === "disabled"}
                        padding="0"
                        borderRadius="0"
                        mb={j % 4 === 3 ? "0.4rem" : "0"}
                      />
                    )
                )}
              </VStack>
            )
        )}

        <IconButton
          aria-label="Calendar Right"
          onClick={() =>
            setHorizontalDatesIndex(horizontalDatesIndex + horizontalDateWindow)
          }
          visibility={
            horizontalDatesIndex + horizontalDateWindow < dates.length
              ? undefined
              : "hidden"
          }
          margin="auto"
          icon={<FiChevronRight size="1.5rem" />}
          color="sec.100"
          bg="pri.200"
          size="md"
          _hover={{ bg: "pri.300" }}
        />
      </HStack>

      <IconButton
        aria-label="Calendar Down"
        onClick={() =>
          setVerticalDatesIndex(verticalDatesIndex + verticalDateWindow)
        }
        visibility={
          verticalDatesIndex + verticalDateWindow < 24 * 4
            ? undefined
            : "hidden"
        }
        icon={<FiChevronDown size="1.5rem" />}
        color="sec.100"
        bg="pri.200"
        size="md"
        _hover={{ bg: "pri.300" }}
      />
    </VStack>
  );
}
