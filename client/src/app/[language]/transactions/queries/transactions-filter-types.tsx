import { Category } from "@/services/api/types/category";
import { Transaction } from "@/services/api/types/import-data";
import { SortEnum } from "@/services/api/types/sort-type";

export type TransactionFilterType = {
  categories?: Category[];
};

export type TransactionSortType = {
  orderBy: keyof Transaction;
  order: SortEnum;
};
