import { useMontlyTotalsTransactionQuery } from "@/app/[language]/transactions/queries/transaction-queries";
import {
  BestTimeUnitRequest,
  BestTotalsTimeUnit,
  TransactionTotals,
  TransactionTotalsResponse,
} from "@/services/api/services/transactions";
import { GraphPeriod } from "@/services/api/types/transactions";
import { LineChart } from "@mui/x-charts";
import { formatDate } from "date-fns";
import numeral from "numeral";
import { FC } from "react";

type TotalsGraphProps = {
  height?: number;
  period?: GraphPeriod;
};

const TotalsGraph: FC<TotalsGraphProps> = ({ height = 300, period }) => {
  const timeUnit: BestTotalsTimeUnit =
    period?.from && period?.to
      ? BestTimeUnitRequest(period.from, period.to, "totals")
      : "yearly-totals";
  const { data } = useMontlyTotalsTransactionQuery({
    from: period?.from?.getTime(),
    to: period?.to?.getTime(),
  });
  const yAxisMax = data
    ?.map((item) => item.balance)
    .reduce((prev, current) => Math.max(prev, current), 0);

  const formatedData = (graphData: TransactionTotalsResponse) => {
    const getDate = (item: TransactionTotals) => {
      switch (timeUnit) {
        case "daily-totals":
          return new Date(item.year, item.month - 1, item.day);
        case "monthly-totals":
          return new Date(item.year, item.month - 1, 1);
        default:
          return new Date(item.year, 1, 1);
      }
    };
    return graphData.map((item) => ({
      date: getDate(item),
      balance: Math.round(item.balance * 100) / 100,
    }));
  };

  if (!data) {
    return <></>;
  }

  return (
    <LineChart
      xAxis={[
        {
          id: "balance",
          dataKey: "date",
          scaleType: "time",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          valueFormatter: (date: Date, context: any) => {
            if (context.location === "tooltip") {
              return formatDate(date, "MMMM yyyy");
            }
            switch (timeUnit) {
              case "daily-totals":
                return formatDate(date, "dd/MM/yyyy");
              case "monthly-totals":
                return formatDate(date, "MM/yyyy");
              default:
                return date.getFullYear().toString();
            }
          },
          disableLine: true,
        },
      ]}
      yAxis={[{ id: "date", max: yAxisMax, disableLine: true }]}
      series={[
        {
          dataKey: "balance",
          // area: true,
          showMark: false,
          valueFormatter: (value: string) =>
            `${numeral(value).format("0,0.00")}€`,
        },
      ]}
      dataset={formatedData(data)}
      height={height}
      // sx={{
      //   [`& .${lineElementClasses.root}`]: {
      //     display: 'none',
      //   },
      // }}
    />
  );
};

export default TotalsGraph;
