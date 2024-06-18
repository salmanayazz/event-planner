import { Button, Heading, Box, Flex, HStack, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Availability, Event } from "../contexts/events/EventsContext";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/auth/AuthContext";

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
  const { user } = useAuth();

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
  }, [
    end,
    event.availabilities,
    event.availabilityEndTime,
    event.availabilityStartTime,
    start,
    user?.id,
  ]);

  const handleClick = (
    dateSlot: DateSlot,
    i: number,
    timeSlot: TimeSlot,
    j: number
  ) => {
    // if the time slot is selected, delete it
    if (timeSlot.status === "selected") {
      onDelete(timeSlot.time);
    } else if (timeSlot.status === "not selected") {
      onCreate(timeSlot.time);
    }

    // immediately update the UI
    const newDates = [...dates];
    newDates[i].timeSlots[j].status =
      timeSlot.status === "selected" ? "not selected" : "selected";

    setDates(newDates as DateSlot[]);
  };

  return (
    <VStack justifyContent="start" alignItems="start">
      <HStack>
        <Box width="3rem" />
        {dates.map((dateSlot, i) => (
          <VStack
            key={`date: ${i}`}
            height="100%"
            align="center"
            justifyContent="end"
            width="3rem"
          >
            {(i === 0 ||
              (new Date(dateSlot.date).getMonth() === 0 &&
                new Date(dateSlot.date).getDate() === 1)) && (
              <Heading size="sm" color="sec.100">
                {new Date(dateSlot.date).getFullYear()}
              </Heading>
            )}
            {(i === 0 || new Date(dateSlot.date).getDate() === 1) && (
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
        ))}
      </HStack>

      <HStack alignItems="start" justifyContent="start">
        <VStack width="3rem" height="100%" justifyContent="space-evenly">
          {dates[0]?.timeSlots.map(
            (timeSlot, i) =>
              i % 4 === 0 && ( // show the label only for each hour
                <Heading size="sm" color="sec.100" key={`time: ${i}`}>
                  {new Date(timeSlot.time).getHours()}:00
                </Heading>
              )
          )}
        </VStack>

        {dates.map((dateSlot, i) => (
          <VStack key={`dateSlot: ${i}`} spacing="0">
            {dateSlot.timeSlots.map((timeSlot, j) => (
              <Button
                key={`timeSlot: ${j}`}
                height="0.5rem"
                width="3rem"
                bg={
                  timeSlot.status === "selected"
                    ? "green"
                    : timeSlot.status === "not selected"
                    ? "sec.100"
                    : "red"
                }
                onClick={() => {
                  handleClick(dateSlot, i, timeSlot, j);
                  console.log("dateSlot.date: " + timeSlot.time);
                }}
                isDisabled={timeSlot.status === "disabled"}
                padding="0"
                borderRadius="0"
                mb={j % 4 === 3 ? "0.4rem" : "0"}
              />
            ))}
          </VStack>
        ))}
      </HStack>
    </VStack>
  );
}
