import { Button, Heading, Box, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface TimeSelectorProps {
  start: number;
  end: number;
  onSubmit: (enabledTimes: number[]) => void;
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
  start,
  end,
  onSubmit,
}: TimeSelectorProps) {
  const [dates, setDates] = useState<DateSlot[]>([]);

  useEffect(() => {
    const tempDates: DateSlot[] = [];
    const startDate = new Date(start);
    const endDate = new Date(end);

    const currentDate = new Date(startDate);

    // iterate through each day and create a time slot for each 15-minute interval
    while (currentDate <= endDate) {
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
            time.getTime() < startDate.getTime() ||
            time.getTime() > endDate.getTime()
              ? "disabled"
              : "not selected",
        });
      }
      tempDates.push({ date: date.getTime(), timeSlots });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    setDates(tempDates);
  }, [start, end]);

  const handleClick = (date: number, timeSlot: TimeSlot) => {
    const newDates = dates.map((dateSlot) => {
      if (dateSlot.date === date) {
        return {
          date: dateSlot.date,
          timeSlots: dateSlot.timeSlots.map((time) => {
            if (time.time === timeSlot.time) {
              return {
                time: time.time,
                status:
                  time.status === "selected"
                    ? "not selected"
                    : time.status === "not selected"
                    ? "selected"
                    : time.status,
              };
            }
            return time;
          }),
        };
      }
      return dateSlot;
    });

    setDates(newDates as DateSlot[]);
    handleSubmit();
  };

  const handleSubmit = () => {
    const enabledTimes = dates
      .map((dateSlot) =>
        dateSlot.timeSlots
          .filter((timeSlot) => timeSlot.status === "selected")
          .map((timeSlot) => timeSlot.time)
      )
      .flat();
    onSubmit(enabledTimes);
  };

  return (
    <Box>
      <Flex>
        <Box width="4rem" />
        {dates.map((dateSlot, i) => (
          <Flex
            key={dateSlot.date}
            direction="column"
            align="center"
            flex="1"
            justifyContent="end"
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
          </Flex>
        ))}
      </Flex>
      {dates[0]?.timeSlots.map((timeSlot, i) => (
        <Flex key={timeSlot.time} height="0.4rem" gap="0.3rem">
          <Flex align="center" justify="center" width="4rem">
            {i % 4 === 0 && ( // show the label only for each hour
              <Heading size="sm" color="sec.100">
                {new Date(timeSlot.time).getHours()}:00
              </Heading>
            )}
          </Flex>
          {dates.map((dateSlot, j) => (
            <Flex
              key={j}
              flex="1"
              align="center"
              justify="center"
              height="100%"
            >
              <Button
                height="100%"
                bg={
                  dateSlot.timeSlots[i].status === "selected"
                    ? "green"
                    : dateSlot.timeSlots[i].status === "not selected"
                    ? "sec.100"
                    : "red"
                }
                onClick={() =>
                  handleClick(dateSlot.date, dateSlot.timeSlots[i])
                }
                isDisabled={dateSlot.timeSlots[i].status === "disabled"}
                padding="0"
                borderRadius="0"
                mb={i % 4 === 3 ? "0.4rem" : "0"}
              />
            </Flex>
          ))}
        </Flex>
      ))}
    </Box>
  );
}
