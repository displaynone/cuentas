import { Category } from "./category";

export type Transaction = {
  balance?: number | null;
  amount: number;
  reference: string;
  description?: string | null;
  concept: string;
  date: number;
  id: string;
  categories: Category[];
};
