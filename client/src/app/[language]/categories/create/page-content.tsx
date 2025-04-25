"use client";

import FormTextInput from "@/components/form/text-input/form-text-input";
import Link from "@/components/link";
import { useSnackbar } from "@/hooks/use-snackbar";
import { usePostCategoryService } from "@/services/api/services/category";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { RoleEnum } from "@/services/api/types/role";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import { useTranslation } from "@/services/i18n/client";
import useLeavePage from "@/services/leave-page/use-leave-page";
import { yupResolver } from "@hookform/resolvers/yup";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { FormProvider, useForm, useFormState } from "react-hook-form";
import * as yup from "yup";

type CreateCategoryFormData = {
  name: string;
  description?: string;
  match: string;
};

const useValidationSchema = () => {
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

function CreateUserFormActions() {
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
      {t("categories:create.actions.submit")}
    </Button>
  );
}

function CreateCategory() {
  const { t } = useTranslation("categories");
  const router = useRouter();
  const fetchPostUser = usePostCategoryService();
  const validationSchema = useValidationSchema();

  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm<CreateCategoryFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: "",
      description: "",
      match: "",
    },
  });

  const { handleSubmit, setError } = methods;

  const onSubmit = handleSubmit(async (formData) => {
    const { data, status } = await fetchPostUser(formData);
    if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
      (Object.keys(data.errors) as Array<keyof CreateCategoryFormData>).forEach(
        (key) => {
          setError(key, {
            type: "manual",
            message: t(
              `categories:inputs.${key}.validation.server.${data.errors[key]}`
            ),
          });
        }
      );
      return;
    }
    if (status === HTTP_CODES_ENUM.CREATED) {
      enqueueSnackbar(t("categories:alerts.create.success"), {
        variant: "success",
      });
      router.push("/categories");
    }
  });

  return (
    <FormProvider {...methods}>
      <Container maxWidth="xs">
        <form onSubmit={onSubmit} autoComplete="create-new-user">
          <Grid container spacing={2} mb={3} mt={3}>
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6">{t("create.title")}</Typography>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormTextInput<CreateCategoryFormData>
                name="name"
                testId="new-user-name"
                autoComplete="new-user-name"
                label={t("categories:create.inputs.name.label")}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormTextInput<CreateCategoryFormData>
                name="description"
                testId="new-user-description"
                autoComplete="new-user-description"
                label={t("categories:create.inputs.description.label")}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormTextInput<CreateCategoryFormData>
                name="match"
                testId="new-user-match"
                autoComplete="new-user-match"
                label={t("categories:create.inputs.match.label")}
                multiline
                minRows={4}
              />
              <Typography variant="body2">
                {t("categories:create.inputs.match.description")}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <CreateUserFormActions />
              <Box ml={1} component="span">
                <Button
                  variant="contained"
                  color="inherit"
                  LinkComponent={Link}
                  href="/admin-panel/users"
                >
                  {t("categories:create.actions.cancel")}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Container>
    </FormProvider>
  );
}

export default withPageRequiredAuth(CreateCategory, {
  roles: [RoleEnum.USER, RoleEnum.ADMIN],
});
