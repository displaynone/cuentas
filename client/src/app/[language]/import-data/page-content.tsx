"use client";

import { LoadingIcon } from "@/components/loading-icon";
import { useSnackbar } from "@/hooks/use-snackbar";
import { usePostTransactionsService } from "@/services/api/services/transactions";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { Transaction } from "@/services/api/types/import-data";
import { RoleEnum } from "@/services/api/types/role";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import { useTranslation } from "@/services/i18n/client";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import numeral from "numeral";
import { ChangeEvent, useEffect, useState } from "react";
import ImportPopover, { ColumnsReference } from "./import-popover";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const ButtonContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "1rem",
});

function ImportData() {
  const { t } = useTranslation("import-data");
  const [file, setFile] = useState<File | null>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [lines, setLines] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const importTransactions = usePostTransactionsService();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
    setPopoverOpen(true);
  };

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result;
        const parsedLines = (content as string).split("\n");
        setColumns(parsedLines[0].split("\t"));
        setLines(parsedLines.slice(1));
      };
      reader.readAsText(file);
    }
  }, [file]);

  const strToNum = (str: string) => {
    return (
      numeral(
        str.replace(/,(\d+)$/, ".$1").replace(/\.(\d{3})/, "$1")
      ).value() || 0
    );
  };

  const handleSave = async (columns: ColumnsReference) => {
    console.log(lines);
    const postData: Transaction[] = lines
      .filter((line) => line)
      .map((line) => {
        const values = line.split("\t");
        const [dd, mm, yyyy] = values[columns.date || 0].split(/[^\d]+/);
        const date = new Date();
        date.setUTCFullYear(+yyyy);
        date.setUTCMonth(+mm - 1);
        date.setUTCDate(+dd);
        date.setUTCHours(0);
        date.setUTCMinutes(0);
        date.setUTCSeconds(0);
        const transaction: Transaction = {
          amount: strToNum(values[columns.amount || 0]),
          reference: values[columns.reference || 0],
          concept: values[columns.concept || 0],
          description: values[columns.description || 0],
          date: date.getTime(),
          id: values[columns.id || 0],
          balance: strToNum(values[columns.balance || 0]),
          categories: [],
        };
        console.log(transaction);
        return transaction;
      });
    setLoading(true);
    const { data, status } = await importTransactions(postData);
    setLoading(false);
    if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
      (Object.keys(data.errors) as Array<keyof Transaction>).forEach(() => {
        enqueueSnackbar(t("import-data:error.404"), {
          variant: "error",
        });
      });
      return;
    }
    if (status === HTTP_CODES_ENUM.CREATED) {
      enqueueSnackbar(t("import-data:success.import"), {
        variant: "success",
      });
      router.push("/transactions");
    }
  };

  return (
    <Container maxWidth="md">
      <Grid
        container
        spacing={3}
        wrap="nowrap"
        pt={3}
        display={"flex"}
        flexDirection={"column"}
        gap={3}
      >
        <Typography variant="h2">{t("title")}</Typography>
        <Typography variant="body1">{t("description")}</Typography>
        <Grid>
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<UploadFileRoundedIcon />}
            disabled={loading}
          >
            <ButtonContainer>
              <span>{loading ? t("import-data:importing") : t("upload")}</span>
              <VisuallyHiddenInput
                type="file"
                onChange={handleFileChange}
                multiple
                accept=".csv"
              />
              {loading && <LoadingIcon />}
            </ButtonContainer>
          </Button>
          {file && (
            <Typography variant="body2" mt={2}>
              {t("selectedFile")}: <em>{file.name}</em>
            </Typography>
          )}
        </Grid>
      </Grid>
      <ImportPopover
        open={popoverOpen}
        onClose={() => {
          setPopoverOpen(false);
          setFile(null);
        }}
        columns={columns}
        onSave={handleSave}
      />
    </Container>
  );
}

export default withPageRequiredAuth(ImportData, {
  roles: [RoleEnum.USER, RoleEnum.ADMIN],
});
