import {
  GetTimelyTotalsRequest,
  useGetByCategoryTransactionService,
  useGetTotalsTransactionService,
  useGetTransactionsService,
} from "@/services/api/services/transactions";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { createQueryKeys } from "@/services/react-query/query-key-factory";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  TransactionFilterType,
  TransactionSortType,
} from "./transactions-filter-types";

export const transactionsQueryKeys = createQueryKeys(["transactions"], {
  list: () => ({
    key: [],
    sub: {
      by: ({
        sort,
        filter,
      }: {
        filter: TransactionFilterType | undefined;
        sort?: TransactionSortType | undefined;
      }) => ({
        key: [sort, filter],
      }),
    },
  }),
  Totals: () => ({
    key: [],
    sub: {
      by: ({
        from,
        to,
      }: {
        from: number | undefined;
        to: number | undefined;
      }) => ({
        key: [from, to],
      }),
    },
  }),
  ByCategory: () => ({
    key: [],
    sub: {
      by: ({
        from,
        to,
      }: {
        from: number | undefined;
        to: number | undefined;
      }) => ({
        key: [from, to],
      }),
    },
  }),
});

export const useTransactionListQuery = ({
  sort,
  filter,
}: {
  filter?: TransactionFilterType | undefined;
  sort?: TransactionSortType | undefined;
} = {}) => {
  const fetch = useGetTransactionsService();

  const query = useInfiniteQuery({
    queryKey: transactionsQueryKeys.list().key,
    initialPageParam: 1,
    queryFn: async ({ pageParam, signal }) => {
      const { status, data } = await fetch(
        {
          page: pageParam,
          limit: 10,
          filters: filter,
          sort: sort ? [sort] : undefined,
        },
        {
          signal,
        }
      );

      if (status === HTTP_CODES_ENUM.OK) {
        return {
          data: data.data,
          nextPage: data.hasNextPage ? pageParam + 1 : undefined,
        };
      }
    },
    getNextPageParam: (lastPage) => {
      return lastPage?.nextPage;
    },
    gcTime: 0,
  });

  return query;
};

export const useMontlyTotalsTransactionQuery = (
  request: GetTimelyTotalsRequest
) => {
  const fetch = useGetTotalsTransactionService();

  const query = useQuery({
    queryKey: transactionsQueryKeys.Totals().sub.by({
      from: request.from,
      to: request.to,
    }).key,
    queryFn: async () => {
      console.log({ request });
      const { status, data } = await fetch(request);

      if (status === HTTP_CODES_ENUM.OK) {
        return data;
      }
    },
  });
  return query;
};

export const useMontlyByCategoryTransactionQuery = (
  request: GetTimelyTotalsRequest
) => {
  console.log(
    "%cuseMontlyByCategoryTransactionQuery",
    "font-size: 1.5em; color: purple;"
  );
  const fetch = useGetByCategoryTransactionService();

  const query = useQuery({
    queryKey: transactionsQueryKeys.ByCategory().sub.by({
      from: request.from,
      to: request.to,
    }).key,
    queryFn: async () => {
      console.log({ request });
      const { status, data } = await fetch(request);

      if (status === HTTP_CODES_ENUM.OK) {
        return data;
      }
    },
  });
  return query;
};
