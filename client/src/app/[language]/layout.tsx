import ResponsiveAppLayout from "@/components/app-layout";
import ConfirmDialogProvider from "@/components/confirm-dialog/confirm-dialog-provider";
import InitColorSchemeScript from "@/components/theme/init-color-scheme-script";
import ThemeProvider from "@/components/theme/theme-provider";
import AuthProvider from "@/services/auth/auth-provider";
import { getServerTranslation } from "@/services/i18n";
import "@/services/i18n/config";
import { languages } from "@/services/i18n/config";
import StoreLanguageProvider from "@/services/i18n/store-language-provider";
import LeavePageProvider from "@/services/leave-page/leave-page-provider";
import queryClient from "@/services/react-query/query-client";
import QueryClientProvider from "@/services/react-query/query-client-provider";
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/700.css";
import CssBaseline from "@mui/material/CssBaseline";
import { dir } from "i18next";
import type { Metadata } from "next";
import "../globals.css";
import { ToastContainer } from "react-toastify";

type Props = {
  params: Promise<{ language: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { t } = await getServerTranslation(params.language, "common");

  return {
    title: t("title"),
  };
}

export function generateStaticParams() {
  return languages.map((language) => ({ language }));
}

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ language: string }>;
}) {
  const params = await props.params;

  const { language } = params;

  const { children } = props;

  return (
    <html lang={language} dir={dir(language)} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <InitColorSchemeScript />
        <QueryClientProvider client={queryClient}>
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
          <ThemeProvider>
            <CssBaseline />

            <StoreLanguageProvider>
              <ConfirmDialogProvider>
                <AuthProvider>
                  <LeavePageProvider>
                    <ResponsiveAppLayout>{children}</ResponsiveAppLayout>
                    {/* <DashboardLayoutBase>{children}</DashboardLayoutBase> */}
                    <ToastContainer position="bottom-left" hideProgressBar />
                  </LeavePageProvider>
                </AuthProvider>
              </ConfirmDialogProvider>
            </StoreLanguageProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
