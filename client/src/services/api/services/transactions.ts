import { useCallback } from "react";
import useFetch from "../use-fetch";
import { API_URL } from "../config";
import wrapperFetchJsonResponse from "../wrapper-fetch-json-response";
import { InfinityPaginationType } from "../types/infinity-pagination";
import { SortEnum } from "../types/sort-type";
import { RequestConfigType } from "./types/request-config";
import { Transaction } from "../types/import-data";
import { Category } from "../types/category";

export type TransactionsRequest = {
  page: number;
  limit: number;
  filters?: {
    categories?: Category[];
  };
  sort?: Array<{
    orderBy: keyof Transaction;
    order: SortEnum;
  }>;
};

export type TransactionsResponse = InfinityPaginationType<Transaction>;

export function useGetTransactionsService() {
  const fetch = useFetch();

  return useCallback(
    (data: TransactionsRequest, requestConfig?: RequestConfigType) => {
      const requestUrl = new URL(`${API_URL}/v1/transactions`);
      requestUrl.searchParams.append("page", data.page.toString());
      requestUrl.searchParams.append("limit", data.limit.toString());
      if (data.filters) {
        requestUrl.searchParams.append("filters", JSON.stringify(data.filters));
      }
      if (data.sort) {
        requestUrl.searchParams.append("sort", JSON.stringify(data.sort));
      }

      return fetch(requestUrl, {
        method: "GET",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<TransactionsResponse>);
    },
    [fetch]
  );
}

export type TransactionRequest = {
  id: Transaction["id"];
};

export type TransactionResponse = Transaction;

export function useGetTransactionService() {
  const fetch = useFetch();

  return useCallback(
    (data: TransactionRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/transactions/${data.id}`, {
        method: "GET",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<TransactionResponse>);
    },
    [fetch]
  );
}

export type TransactionPostRequest =
  | Pick<
      Transaction,
      "amount" | "reference" | "concept" | "date" | "description" | "balance"
    >
  | { categories: number[] };

export type TransactionPostResponse = Transaction;

export function usePostTransactionService() {
  const fetch = useFetch();

  return useCallback(
    (data: TransactionPostRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/transactions`, {
        method: "POST",
        body: JSON.stringify(data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<TransactionPostResponse>);
    },
    [fetch]
  );
}

export function usePostTransactionsService() {
  const fetch = useFetch();

  return useCallback(
    (data: TransactionPostRequest[], requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/transactions/import`, {
        method: "POST",
        body: JSON.stringify(data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<TransactionPostResponse>);
    },
    [fetch]
  );
}

export type TransactionPatchRequest = {
  id: Transaction["id"];
  data: Partial<TransactionPostRequest>;
};

export type TransactionPatchResponse = Transaction;

export function usePatchTransactionService() {
  const fetch = useFetch();

  return useCallback(
    (data: TransactionPatchRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/transactions/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify(data.data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<TransactionPatchResponse>);
    },
    [fetch]
  );
}

export type TransactionsDeleteRequest = {
  id: Transaction["id"];
};

export type TransactionsDeleteResponse = undefined;

export function useDeleteTransactionsService() {
  const fetch = useFetch();

  return useCallback(
    (data: TransactionsDeleteRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/transactions/${data.id}`, {
        method: "DELETE",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<TransactionsDeleteResponse>);
    },
    [fetch]
  );
}

export type TransactionTotals = {
  year: number;
  month: number;
  day: number;
  balance: number;
};
export type TransactionTotalsResponse = TransactionTotals[];

export type TransactionByCategory = {
  categoryName: string;
  categoryId: number;
  year: number;
  month: string;
  day: string;
  amount: number;
};
export type TransactionByCategoryResponse = TransactionByCategory[];

export type GetTimelyTotalsRequest = {
  from?: number;
  to?: number;
};

const QueryTypes = ["totals", "by-category"] as const;
export type QueryType = (typeof QueryTypes)[number];

const BestTotalsTimeUnits = [
  "daily-totals",
  "monthly-totals",
  "yearly-totals",
] as const;
export type BestTotalsTimeUnit = (typeof BestTotalsTimeUnits)[number];

const BestByCategoryTimeUnits = [
  "daily-by-category",
  "monthly-by-category",
  "yearly-by-category",
] as const;
export type BestByCategoryTimeUnit = (typeof BestByCategoryTimeUnits)[number];

export type BestTimeUnit = BestTotalsTimeUnit | BestByCategoryTimeUnit;

export function BestTimeUnitRequest<T extends QueryType>(
  startDate: Date,
  endDate: Date,
  queryType?: T
): T extends "totals" ? BestTotalsTimeUnit : BestByCategoryTimeUnit {
  let start = new Date(startDate);
  let end = new Date(endDate);

  // Ensure start is before end
  if (start > end) [start, end] = [end, start];

  const msInOneDay = 1000 * 60 * 60 * 24;
  const diffInDays = Math.floor((end.getTime() - start.getTime()) / msInOneDay);

  const diffInMonths =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());

  if (queryType === "totals") {
    if (diffInDays < 30 || diffInMonths < 4) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return "daily-totals" as any;
    } else if (diffInMonths < 12) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return "monthly-totals" as any;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return "yearly-totals" as any;
    }
  } else if (queryType === "by-category") {
    if (diffInDays < 30 || diffInMonths < 4) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return "daily-by-category" as any;
    } else if (diffInMonths < 12) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return "monthly-by-category" as any;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return "yearly-by-category" as any;
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return "yearly-totals" as any;
}

export function useGetTotalsTransactionService() {
  const fetch = useFetch();

  return useCallback(
    (data: GetTimelyTotalsRequest, requestConfig?: RequestConfigType) => {
      const path: BestTimeUnit =
        data.from && data.to
          ? BestTimeUnitRequest(
              new Date(data.from),
              new Date(data.to),
              "totals"
            )
          : "yearly-totals";
      return fetch(
        `${API_URL}/v1/transactions/${path}?from=${data.from || ""}&to=${data.to || ""}`,
        {
          method: "GET",
          ...requestConfig,
        }
      ).then(wrapperFetchJsonResponse<TransactionTotalsResponse>);
    },
    [fetch]
  );
}

export function useGetByCategoryTransactionService() {
  const fetch = useFetch();

  return useCallback(
    (data: GetTimelyTotalsRequest, requestConfig?: RequestConfigType) => {
      const path: BestTimeUnit =
        data.from && data.to
          ? BestTimeUnitRequest(
              new Date(data.from),
              new Date(data.to),
              "by-category"
            )
          : "yearly-by-category";
      return fetch(
        `${API_URL}/v1/transactions/${path}?from=${data.from || ""}&to=${data.to || ""}`,
        {
          method: "GET",
          ...requestConfig,
        }
      ).then(wrapperFetchJsonResponse<TransactionByCategoryResponse>);
    },
    [fetch]
  );
}
