import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Grid2 from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";

import { useGetCategoriesService } from "@/services/api/services/category";
import { Category } from "@/services/api/types/category";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { Transaction } from "@/services/api/types/import-data";
import { useTranslation } from "@/services/i18n/client";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import FormControlLabel from "@mui/material/FormControlLabel";
import { FC, useEffect, useState } from "react";
import Loading from "../loading";
import { usePatchTransactionService } from "@/services/api/services/transactions";

type CategoriesDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (transaction: Transaction) => void;
  transaction?: Transaction;
};

type SelectedCategories = Record<string, boolean>;

const CategoriesDialog: FC<CategoriesDialogProps> = ({
  onClose,
  onSubmit,
  open,
  transaction,
}) => {
  const { t } = useTranslation("transactions");
  const [categories, setCategories] = useState<Category[]>();
  const [selectedCategories, setSelectedCategories] =
    useState<SelectedCategories>({});
  const fetchCategories = useGetCategoriesService();
  const updateTransaction = usePatchTransactionService();

  console.log({ categories });

  useEffect(() => {
    if (transaction) {
      const selectedCategoryIds = transaction.categories.map(
        (category) => category.id
      );

      setSelectedCategories(
        transaction.categories.reduce((result, category) => {
          result[category.id || ""] = selectedCategoryIds.includes(category.id);
          return result;
        }, {} as SelectedCategories)
      );
    }
  }, [transaction]);

  useEffect(() => {
    if (categories === undefined) {
      fetchCategories({ limit: 1000, page: 1 }).then(({ data, status }) => {
        if (status === HTTP_CODES_ENUM.OK) {
          setCategories(data.data);
        }
      });
    }
  }, [categories, fetchCategories]);

  const handleClose = () => {
    onClose();
  };

  if (!transaction) {
    return <></>;
  }

  if (!categories) {
    return <Loading />;
  }

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>{t("categories.modal.title")}</DialogTitle>
      <DialogContent>
        <Grid2 container spacing={2}>
          {!categories.length && <Typography>No categories</Typography>}
          {categories.map((category, index) => {
            const handleChange = (
              event: React.ChangeEvent<HTMLInputElement>
            ) => {
              setSelectedCategories({
                ...selectedCategories,
                [category.id || ""]: event.currentTarget.checked,
              });
            };
            return (
              <Grid2 size={4} key={index}>
                <FormControlLabel
                  checked={selectedCategories[category.id || ""] ?? false}
                  control={<Checkbox onChange={handleChange} />}
                  label={category.name}
                />
              </Grid2>
            );
          })}
        </Grid2>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={() => {
            if (transaction.id) {
              const selectedIds = Object.keys(selectedCategories).filter(
                (id) => selectedCategories[id]
              );
              updateTransaction({
                id: transaction.id,
                data: {
                  categories: selectedIds.map((id) => +id),
                },
              }).then(({ data, status }) => {
                if (status === HTTP_CODES_ENUM.OK) {
                  onSubmit(data);
                }
              });
            }
          }}
        >
          {t("categories.modal.actions.save")}
        </Button>
        <Button variant="outlined" onClick={() => handleClose()}>
          {t("categories.modal.actions.cancel")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoriesDialog;
