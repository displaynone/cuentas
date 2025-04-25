"use client";

import ListTable from "@/components/list-table";
import { Category } from "@/services/api/types/category";
import { RoleEnum } from "@/services/api/types/role";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import { useTranslation } from "@/services/i18n/client";
import Add from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Grid2 from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { FC, useMemo } from "react";
import { useCategoryListQuery } from "./queries/categories-queries";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDeleteCategoriesService } from "@/services/api/services/category";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { useSnackbar } from "@/hooks/use-snackbar";

const ListCategories: FC = () => {
  const { t } = useTranslation("categories");
  const { enqueueSnackbar } = useSnackbar();

  const router = useRouter();

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage, refetch } =
    useCategoryListQuery();
  const deleteCategory = useDeleteCategoriesService();

  const result = useMemo(() => {
    return (
      (data?.pages.flatMap((page) => page?.data) as Category[]) ??
      ([] as Category[])
    )
      .filter((item) => !!item)
      .map((category, index) => [
        category.name,
        category.description,
        category.match.split("\n").join("<br />"),
        <Grid2 display="flex" key={index} gap={0}>
          <IconButton
            onClick={() => {
              router.push(`/categories/edit/${category.id}`);
            }}
            color="primary"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              deleteCategory({ name: category.name }).then(({ status }) => {
                console.log(status);
                if (status === HTTP_CODES_ENUM.NO_CONTENT) {
                  enqueueSnackbar(t("categories:delete.ok"), {
                    variant: "success",
                  });
                  refetch();
                }
              });
            }}
            color="secondary"
          >
            <DeleteIcon />
          </IconButton>
        </Grid2>,
      ]);
  }, [data?.pages, deleteCategory, enqueueSnackbar, refetch, router, t]);

  const columns = [
    t("categories:list.columns.name"),
    t("categories:list.columns.description"),
    t("categories:list.columns.match"),
    "",
  ];

  return (
    <Container
      maxWidth="md"
      sx={{ display: "flex", flexDirection: "column", height: "100%" }}
    >
      <Grid2 container spacing={2} my={4} justifyContent="center">
        <Grid2 size="grow">
          <Typography variant="h2">{t("title")}</Typography>
        </Grid2>
        <Grid2 size="auto" alignSelf="center">
          <Button
            variant="contained"
            color="primary"
            type="submit"
            startIcon={<Add />}
            onClick={() => {
              router.push("/categories/create");
            }}
          >
            {t("categories:actions.create")}
          </Button>
        </Grid2>
      </Grid2>
      <Grid2 size={{ xs: 12 }} mb={2} sx={{ flexGrow: 1 }}>
        <ListTable
          data={result}
          columns={columns}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      </Grid2>
    </Container>
  );
};

export default withPageRequiredAuth(ListCategories, {
  roles: [RoleEnum.USER, RoleEnum.ADMIN],
});
