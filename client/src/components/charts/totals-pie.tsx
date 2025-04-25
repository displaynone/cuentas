import { useMontlyByCategoryTransactionQuery } from "@/app/[language]/transactions/queries/transaction-queries";
import { GraphPeriod } from "@/services/api/types/transactions";
import { PieChart } from "@mui/x-charts/PieChart";
import { FC } from "react";
import { countCategoryData } from "./utils/countCategoryData";

type TotalsGraphProps = {
  height?: number;
  period?: GraphPeriod;
};

const TotalsPie: FC<TotalsGraphProps> = ({ height = 300, period }) => {
  const { data } = useMontlyByCategoryTransactionQuery({
    from: period?.from?.getTime(),
    to: period?.to?.getTime(),
  });

  if (!data) {
    return <></>;
  }

  const formatedData = countCategoryData(data);
  const filteredData = formatedData.filter((item) => item.value < 0);
  const positiveData = filteredData.map((item) => ({
    ...item,
    value: -1 * item.value,
  }));

  return (
    <PieChart
      series={[{ data: positiveData }]}
      height={height}
      hideLegend={true}
    />
  );
};

export default TotalsPie;
