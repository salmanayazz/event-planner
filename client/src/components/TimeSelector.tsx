import { Button, Heading, Box } from "@chakra-ui/react";
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

    // iterate through each day and create a time slot for each hour
    while (currentDate <= endDate) {
      const date = new Date(currentDate);
      const timeSlots: TimeSlot[] = [];

      for (let i = 0; i < 24; i++) {
        const time = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate(),
          i
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
    <Box display="table">
      <Box display="table-row">
        <Box display="table-cell" />
        {dates.map((dateSlot) => (
          <Box key={dateSlot.date} display="table-cell" textAlign="center">
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
          </Box>
        ))}
      </Box>
      {dates[0]?.timeSlots.map((timeSlot, i) => (
        <Box key={timeSlot.time} display="table-row">
          <Box display="table-cell" textAlign="center">
            <Heading size="sm" color="sec.100">
              {new Date(timeSlot.time).getHours()}:00
            </Heading>
          </Box>
          {dates.map((dateSlot, j) => (
            <Box key={j} display="table-cell">
              <Button
                height="1rem"
                bg={
                  dateSlot.timeSlots[i].status === "selected"
                    ? "pri.300"
                    : dateSlot.timeSlots[i].status === "not selected"
                    ? "sec.100"
                    : "gray.100"
                }
                onClick={() =>
                  handleClick(dateSlot.date, dateSlot.timeSlots[i])
                }
                isDisabled={dateSlot.timeSlots[i].status === "disabled"}
              />
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
}
