import Box from "@mui/material/Box";
import { DateCalendar } from "@mui/x-date-pickers";
import {
  addMonths,
  format,
  isBefore,
  isSameDay,
  isWithinInterval,
  subMonths,
  isSameMonth,
} from "date-fns";
import DayButton from "./day-button";
import Typography from "@mui/material/Typography";
import { FC, useContext, useRef } from "react";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { DateRangeContext } from "./date-range-context";

const DateRangeCalendarPositions = ["right", "left"] as const;
type DateRangeCalendarPosition = (typeof DateRangeCalendarPositions)[number];
type DateRangeCalendarProps = {
  fromDate: Date | null;
  toDate: Date | null;
  position: DateRangeCalendarPosition;
  onSelect: (date: Date) => void;
};

const DateRangeCalendar: FC<DateRangeCalendarProps> = ({
  fromDate,
  toDate,
  position,
  onSelect,
}) => {
  const { leftDate, rightDate, setLeftDate, setRightDate } =
    useContext(DateRangeContext);
  const yearPickerRef = useRef<HTMLSpanElement | null>(null);

  const isBetweenDates = (date: Date) => {
    return (
      !!fromDate &&
      !!toDate &&
      isWithinInterval(date, { start: fromDate, end: toDate })
    );
  };

  const referenceDate = () => {
    if (!fromDate) {
      if (position === "left") {
        console.log(position, "date 1");
        return new Date();
      } else {
        console.log(position, "date 2");
        return addMonths(new Date(), 1);
      }
    }
    if (!toDate) {
      if (position === "right") {
        console.log(position, "date 3");
        return addMonths(fromDate, 1);
      }
    } else {
      if (isSameMonth(fromDate, toDate)) {
        if (position === "left") {
          console.log(position, "date 4");
          return fromDate;
        } else {
          console.log(position, "date 5");
          return addMonths(toDate, 1);
        }
      } else {
        if (position === "left") {
          console.log(position, "date 6");
          return fromDate;
        } else {
          console.log(position, "date 7");
          return toDate;
        }
      }
    }
    console.log(position, "date 8");
    return new Date(0);
  };

  const showDates = () => {
    if (fromDate && toDate && isSameMonth(fromDate, toDate)) {
      return position === "left";
    }
    return true;
  };

  console.log(position, showDates(), referenceDate());
  const dateValue = position === "left" ? fromDate : toDate;
  return (
    <DateCalendar
      value={showDates() ? dateValue : null}
      onChange={() => {}}
      onMonthChange={(month) => {
        if (position === "left") {
          setLeftDate(month);
        } else {
          setRightDate(month);
        }
      }}
      referenceDate={referenceDate()}
      defaultValue={toDate}
      shouldDisableDate={(date) =>
        !!fromDate && !!toDate && isBefore(date, fromDate)
      }
      slots={{
        day: (props) => {
          const { day, outsideCurrentMonth } = props;
          const isSelected = [toDate, fromDate].some(
            (d) => d && isSameDay(day, d)
          );

          if (!day || outsideCurrentMonth)
            return (
              <Box
                sx={{
                  width: (theme) => theme.spacing(4.5),
                  height: (theme) => theme.spacing(4.5),
                  marginX: 0.25,
                }}
              />
            );
          return (
            <DayButton
              day={day}
              isSelected={isSelected}
              isBetweenRange={isBetweenDates(day)}
              showRange={!!toDate && !!fromDate}
              onClick={onSelect}
            />
          );
        },
        calendarHeader: (props) => {
          const { currentMonth, onMonthChange } = props;

          const leftDisabled =
            leftDate &&
            rightDate &&
            position === "right" &&
            isSameMonth(addMonths(leftDate, 1), rightDate);

          const rightDisabled =
            leftDate &&
            rightDate &&
            position === "left" &&
            isSameMonth(addMonths(leftDate, 1), rightDate);
          return (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              sx={{
                padding: (theme) => theme.spacing(1),
                position: "relative",
              }}
            >
              <IconButton
                onClick={() => {
                  const nextMonth = subMonths(currentMonth, 1);
                  onMonthChange(nextMonth, "left");
                  // handleMonthChange(nextMonth);
                }}
                sx={{ position: "absolute", left: 0 }}
                disabled={leftDisabled}
              >
                <ChevronLeftIcon />
              </IconButton>
              <Typography variant="body1" ref={yearPickerRef}>
                {format(currentMonth, "MMMM yyyy")}
              </Typography>
              <IconButton
                onClick={() => {
                  const nextMonth = addMonths(currentMonth, 1);
                  onMonthChange(nextMonth, "right");
                  // handleMonthChange(nextMonth);
                }}
                sx={{ position: "absolute", right: 0 }}
                disabled={rightDisabled}
              >
                <ChevronRightIcon />
              </IconButton>
            </Box>
          );
        },
      }}
    />
  );
};

export default DateRangeCalendar;
