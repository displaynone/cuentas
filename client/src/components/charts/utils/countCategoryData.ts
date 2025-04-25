import { TransactionByCategoryResponse } from "@/services/api/services/transactions";

export type PieChartData = {
  id: number;
  value: number;
  label: string;
};

export const countCategoryData = (data: TransactionByCategoryResponse) => {
  return Object.values(
    data.reduce(
      (acc, item) => {
        if (!acc[item.categoryId]) {
          acc[item.categoryId] = {
            id: item.categoryId,
            value: 0,
            label: item.categoryName,
          };
        }
        acc[item.categoryId].value += item.amount;
        return acc;
      },
      {} as Record<string, PieChartData>
    )
  );
};
