"use client";

import Importer from "@/components/importer";
import ListTable from "@/components/list-table";
import { Transaction } from "@/services/api/types/import-data";
import { getServerTranslation } from "@/services/i18n";
import { useTranslation } from "@/services/i18n/client";
import SellIcon from "@mui/icons-material/Sell";
import Container from "@mui/material/Container";
import Grid2 from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { format } from "date-fns";
import type { Metadata } from "next";
import numeral from "numeral";
import { FC, useEffect, useMemo, useState } from "react";
import CategoriesDialog from "./categories-dialog";
import { useTransactionListQuery } from "./queries/transaction-queries";

type Props = {
  params: Promise<{ language: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { t } = await getServerTranslation(params.language, "home");

  return {
    title: t("title"),
  };
}

type TransactionsListProps = {
  pagination?: boolean;
};

const TransactionsList: FC<TransactionsListProps> = ({ pagination = true }) => {
  const { t } = useTranslation("transactions");

  const [categoriesModalOpen, setCategoriesModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction>();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useTransactionListQuery();

  useEffect(() => {
    if (data) {
      setTransactions(
        (data?.pages.flatMap((page) => page?.data) as Transaction[]) ??
          ([] as Transaction[])
      );
    }
  }, [data]);

  const result = useMemo(() => {
    const parsedData = transactions
      .filter((item) => !!item)
      .map((transaction) => [
        transaction.reference,
        transaction.concept,
        transaction.description,
        transaction.categories.map((category) => category.name).join("<br />"),
        format(transaction.date, "dd/MM/yyyy"),
        numeral(transaction.amount).format("0,0.0"),
        numeral(transaction.balance).format("0,0.0"),
        <Tooltip
          title={t("transactions:list.columns.edit_categories")}
          key={transaction.id}
        >
          <IconButton
            onClick={() => {
              setSelectedTransaction(transaction);
              setCategoriesModalOpen(true);
            }}
          >
            <SellIcon color="primary" />
          </IconButton>
        </Tooltip>,
      ]);

    return parsedData;
  }, [t, transactions]);

  const columns = [
    t("transactions:list.columns.reference"),
    t("transactions:list.columns.concept"),
    t("transactions:list.columns.description"),
    t("transactions:list.columns.categories"),
    t("transactions:list.columns.date"),
    t("transactions:list.columns.amount"),
    t("transactions:list.columns.balance"),
    "",
  ];

  return (
    <Container maxWidth="xl" sx={{ height: "100%" }}>
      <CategoriesDialog
        open={categoriesModalOpen}
        onClose={() => {
          setCategoriesModalOpen(false);
          setSelectedTransaction(undefined);
        }}
        onSubmit={(transaction) => {
          setCategoriesModalOpen(false);
          setSelectedTransaction(undefined);
          setTransactions(
            transactions.map((t) =>
              t.id === transaction.id
                ? { ...t, categories: transaction.categories }
                : t
            )
          );
        }}
        transaction={selectedTransaction}
      />
      <Grid2
        container
        spacing={3}
        wrap="nowrap"
        pt={3}
        direction="column"
        height="100%"
      >
        <Grid2 size={{ xs: 12 }} mb={2} height="100%">
          <ListTable
            data={result}
            columns={columns}
            fetchNextPage={fetchNextPage}
            hasNextPage={pagination && hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        </Grid2>
        <Grid2 sx={{ display: "flex", justifyContent: "end" }}>
          <Importer />
        </Grid2>
      </Grid2>
    </Container>
  );
};

export default TransactionsList;
