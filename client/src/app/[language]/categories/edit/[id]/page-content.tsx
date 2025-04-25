"use client";

import FormTextInput from "@/components/form/text-input/form-text-input";
import Link from "@/components/link";
import { useSnackbar } from "@/hooks/use-snackbar";
import {
  useGetCategoryService,
  usePatchCategoryService,
} from "@/services/api/services/category";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import { useTranslation } from "@/services/i18n/client";
import useLeavePage from "@/services/leave-page/use-leave-page";
import { yupResolver } from "@hookform/resolvers/yup";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { FormProvider, useForm, useFormState } from "react-hook-form";
import * as yup from "yup";

type EditCategoryFormData = {
  name: string;
  description?: string;
  match: string;
};

const useValidationEditCategorySchema = () => {
  const { t } = useTranslation("categories");

  return yup.object().shape({
    name: yup
      .string()
      .required(t("categories:create:inputs.name.validation.required")),
    description: yup.string(),
    match: yup
      .string()
      .required(t("categories:create:inputs.name.validation.required")),
  });
};

function EditCategoryFormActions() {
  const { t } = useTranslation("categories");
  const { isSubmitting, isDirty } = useFormState();
  useLeavePage(isDirty);

  return (
    <Button
      variant="contained"
      color="primary"
      type="submit"
      disabled={isSubmitting}
    >
      {t("edit.actions.edit")}
    </Button>
  );
}

function FormEditCategory() {
  const params = useParams<{ id: string }>();
  const categoryId = params.id;
  const fetchGetCategory = useGetCategoryService();
  const fetchPatchCategory = usePatchCategoryService();
  const { t } = useTranslation("categories");
  const validationSchema = useValidationEditCategorySchema();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const methods = useForm<EditCategoryFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      description: "",
      match: "",
      name: "",
    },
  });

  const { handleSubmit, setError, reset } = methods;

  const onSubmit = handleSubmit(async (formData) => {
    const { data, status } = await fetchPatchCategory({
      id: categoryId,
      data: {
        ...formData,
      },
    });
    if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
      (Object.keys(data.errors) as Array<keyof EditCategoryFormData>).forEach(
        (key) => {
          setError(key, {
            type: "manual",
            message: t(`categories:inputs.${key}.${data.errors[key]}`),
          });
        }
      );
      return;
    }
    if (status === HTTP_CODES_ENUM.OK) {
      reset(formData);
      enqueueSnackbar(t("categories:alerts.edit.success"), {
        variant: "success",
      });
      router.push("/categories");
    }
  });

  useEffect(() => {
    const getInitialDataForEdit = async () => {
      const { status, data: category } = await fetchGetCategory({
        id: categoryId,
      });

      if (status === HTTP_CODES_ENUM.OK) {
        reset({
          name: category?.name ?? "",
          description: category?.description ?? "",
          match: category?.match ?? "",
        });
      }
    };

    getInitialDataForEdit();
  }, [categoryId, reset, fetchGetCategory]);

  return (
    <FormProvider {...methods}>
      <Container maxWidth="xs">
        <form onSubmit={onSubmit}>
          <Grid container spacing={2} mb={3} mt={3}>
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6">{t("edit.title")}</Typography>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormTextInput<EditCategoryFormData>
                name="name"
                testId="name"
                label={t("create.inputs.name.label")}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormTextInput<EditCategoryFormData>
                name="description"
                testId="description"
                label={t("create.inputs.description.label")}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormTextInput<EditCategoryFormData>
                name="match"
                testId="match"
                label={t("create.inputs.match.label")}
                minRows={4}
                multiline
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <EditCategoryFormActions />
              <Box ml={1} component="span">
                <Button
                  variant="contained"
                  color="inherit"
                  LinkComponent={Link}
                  href="/categories"
                >
                  {t("edit.actions.cancel")}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Container>
    </FormProvider>
  );
}

function EditCategory() {
  return <FormEditCategory />;
}

export default withPageRequiredAuth(EditCategory);
