import { FC, ReactNode, useCallback } from "react";
import { TableVirtuoso } from "react-virtuoso";
import TableComponents from "./table/table-components";
import { UseInfiniteQueryResult } from "@tanstack/react-query";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";
import LinearProgress from "@mui/material/LinearProgress";
import { useTranslation } from "@/services/i18n/client";

type Item = number | string | ReactNode;
type Row = Item[];
type Data = Row[];
type Columns = string[];

const TableCellLoadingContainer = styled(TableCell)(() => ({
  padding: 0,
}));

const TdCell = styled(TableCell)(() => ({
  verticalAlign: "top",
}));

type ListTableProps = {
  data: Data;
  columns: Columns;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: UseInfiniteQueryResult["fetchNextPage"];
};

const ListTable: FC<ListTableProps> = ({
  data,
  columns,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}) => {
  const { t } = useTranslation("common");
  const handleScroll = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <TableVirtuoso
      data={data}
      components={TableComponents}
      endReached={handleScroll}
      overscan={20}
      height="100%"
      increaseViewportBy={400}
      fixedHeaderContent={() => (
        <>
          <TableRow>
            {columns.map((column, index) => (
              <TableCell key={index}>{column}</TableCell>
            ))}
          </TableRow>
          {!data.length && (
            <TableRow>
              <TableCell colSpan={columns.length}>
                {t("table.no-results")}
              </TableCell>
            </TableRow>
          )}
          {isFetchingNextPage && (
            <TableRow>
              <TableCellLoadingContainer colSpan={columns.length}>
                <LinearProgress />
              </TableCellLoadingContainer>
            </TableRow>
          )}
        </>
      )}
      itemContent={(index, row) => (
        <>
          {row.map((item, cellIndex) => (
            <TdCell key={cellIndex}>
              {typeof item === "string" &&
                `${item}`
                  .split(/<br\s*\/>/)
                  .map((item, itemIndex) => <div key={itemIndex}>{item}</div>)}
              {typeof item !== "string" && <>{item}</>}
            </TdCell>
          ))}
        </>
      )}
    />
  );
};

export default ListTable;
