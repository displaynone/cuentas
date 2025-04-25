"use client";

import TotalsCard from "@/components/charts/totals-card";
import useAuth from "@/services/auth/use-auth";
import { useTranslation } from "@/services/i18n/client";
import Container from "@mui/material/Container";
import Grid2 from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { subMonths } from "date-fns";

type Props = {
  params: Promise<{ language: string }>;
};

export default function Home({}: Props) {
  const { t } = useTranslation("dashboard");

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/sign-in");
    }
  }, [router, user]);

  const today = new Date();
  const threeMonthsAgo = subMonths(today, 3);
  const oneMonthsAgo = subMonths(today, 1);

  return (
    <Container maxWidth="xl">
      <Grid2>
        <Typography variant="h1">{t("title")}</Typography>
      </Grid2>
      <Grid2
        container
        spacing={0}
        pt={3}
        sx={{ justifyContent: "flex-start" }}
        gap={6}
      >
        <Grid2 size={12}>
          <Typography variant="h4">{t("main_graph")}</Typography>
          <TotalsCard range={{ from: threeMonthsAgo, to: today }} />
        </Grid2>
        <Grid2 size={6}>
          <TotalsCard
            garphType="pie"
            range={{ from: oneMonthsAgo, to: today }}
          />
        </Grid2>
      </Grid2>
    </Container>
  );
}
