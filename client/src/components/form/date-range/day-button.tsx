import { lighten, SxProps, Theme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

const CLASS_BETWEEN_RANGE = "date-picker-between-range";

type DayButtonProps = {
  day: Date;
  isSelected: boolean;
  isBetweenRange: boolean;
  showRange: boolean;
  onClick: (date: Date) => void;
};

const DayButton: React.FC<DayButtonProps> = ({
  day,
  isSelected,
  isBetweenRange,
  showRange,
  onClick,
}) => {
  const rangeSx: SxProps<Theme> = showRange
    ? {
        ":before": {
          content: "''",
          position: "absolute",
          width: isSelected ? "calc(50% + 2px)" : "calc(100% + 4px)",
          height: "100%",
          background: (theme) =>
            isBetweenRange || isSelected
              ? lighten(theme.palette.primary.main, 0.9)
              : "transparent",
        },
        [`&:has( + .${CLASS_BETWEEN_RANGE}):before`]: {
          left: isSelected ? "50%" : undefined,
        },
      }
    : {};
  return (
    <Box
      className={isBetweenRange && !isSelected ? CLASS_BETWEEN_RANGE : ""}
      sx={{
        position: "relative",
        ...rangeSx,
      }}
    >
      <Button
        variant={isSelected ? "contained" : "text"}
        color={isSelected ? "primary" : "inherit"}
        onClick={() => onClick(day)}
        sx={{
          borderRadius: "50%",
          padding: 0,
          marginX: 0.25,
          minWidth: 0,
          width: (theme) => theme.spacing(4.5),
          height: (theme) => theme.spacing(4.5),
          fontSize: (theme) => theme.typography.htmlFontSize * 0.8,
          position: "relative",
        }}
      >
        {day?.getDate()}
      </Button>
    </Box>
  );
};

export default DayButton;
