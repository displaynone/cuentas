import useLanguage from "@/services/i18n/use-language";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Button from "@mui/material/Button";
import Grid2 from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { isBefore } from "date-fns";
import { FC, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { getValueByKey } from "../date-pickers/helper";
import DateRangeCalendar from "./date-range-calendar";
import { DateRangeProvider } from "./date-range-context";

export type DateRangeData = {
  from: Date | null;
  to: Date | null;
};

type DateRangeProps = {
  onChage: (range: DateRangeData) => void;
};

const DateRange: FC<DateRangeProps> = ({ onChage }) => {
  const { t } = useTranslation("common");
  const language = useLanguage();
  const [opened, setOpened] = useState(false);
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleSelectDate = (date: Date) => {
    if (!fromDate) {
      setFromDate(date);
    } else if (!fromDate && isBefore(date, fromDate)) {
      setFromDate(date);
    } else {
      setToDate(date);
    }
  };

  return (
    <DateRangeProvider>
      <LocalizationProvider
        dateAdapter={AdapterDateFns}
        adapterLocale={getValueByKey(language)}
      >
        <Grid2
          direction={"row"}
          gap={2}
          display="flex"
          ref={containerRef}
          position="relative"
        >
          <IconButton onClick={() => setOpened(!opened)}>
            <CalendarMonthIcon />
          </IconButton>
          <Popover
            open={opened}
            anchorEl={containerRef.current}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            onClose={() => setOpened(false)}
            sx={{
              ".MuiDialogActions-root": {
                display: "none",
              },
            }}
          >
            <Grid2 direction="row" gap={2} display="flex" p={2}>
              <DateRangeCalendar
                fromDate={fromDate}
                toDate={toDate}
                position="left"
                onSelect={handleSelectDate}
              />
              <DateRangeCalendar
                fromDate={fromDate}
                toDate={toDate}
                position="right"
                onSelect={handleSelectDate}
              />
            </Grid2>
            <Grid2
              display="flex"
              direction="row"
              p={2}
              justifyContent="flex-end"
              gap={2}
            >
              <Button
                variant="contained"
                onClick={() => {
                  onChage({ from: fromDate, to: toDate });
                  setOpened(false);
                }}
              >
                {t("date-range:apply")}
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setFromDate(null);
                  setToDate(null);
                  setOpened(false);
                }}
              >
                {t("date-range:cancel")}
              </Button>
            </Grid2>
          </Popover>
        </Grid2>
      </LocalizationProvider>
    </DateRangeProvider>
  );
};

export default DateRange;
