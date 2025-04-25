import TotalsGraph from "@/components/charts/totals-graph";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid2 from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import { format } from "date-fns";

import { GraphPeriod } from "@/services/api/types/transactions";
import Typography from "@mui/material/Typography";
import { FC, useState } from "react";
import DateRange, { DateRangeData } from "../form/date-range/date-range";
import TotalsPie from "./totals-pie";

const GraphTypes = ["line", "pie"] as const;
export type GraphType = (typeof GraphTypes)[number];

type TotalsCardProps = {
  height?: number;
  range?: DateRangeData;
  garphType?: GraphType;
};

const TotalsCard: FC<TotalsCardProps> = ({
  height = 300,
  range = { from: null, to: null },
  garphType = "line",
}) => {
  const [dateRange, setDateRange] = useState<DateRangeData>(range);

  const GraphComponent = garphType === "line" ? TotalsGraph : TotalsPie;
  return (
    <Card variant="elevation">
      <CardContent>
        <Stack
          spacing={2}
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
        >
          {!!dateRange.from && !!dateRange.to && (
            <Typography variant="subtitle2">
              {format(dateRange.from, "dd/MM/yyyy")} -{" "}
              {format(dateRange.to, "dd/MM/yyyy")}
            </Typography>
          )}
          <DateRange onChage={(range) => setDateRange(range)} />
        </Stack>
        <Grid2 container>
          <GraphComponent height={height} period={dateRange as GraphPeriod} />
        </Grid2>
      </CardContent>
    </Card>
  );
};

export default TotalsCard;
