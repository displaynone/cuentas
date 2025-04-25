"use client";
import useAuth from "@/services/auth/use-auth";
import { useTranslation } from "@/services/i18n/client";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import CategoryIcon from "@mui/icons-material/SellOutlined";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import { useRouter } from "next/navigation";

const Importer: React.FC = () => {
  const { user: authUser } = useAuth();

  const { t } = useTranslation("common");
  const router = useRouter();

  if (!authUser) {
    return <></>;
  }

  const actions = [
    {
      name: t("dial.actions.import"),
      icon: <ArrowCircleDownIcon />,
      route: "/import-data",
    },
    {
      name: t("dial.actions.category"),
      icon: <CategoryIcon />,
      route: "/categories/create",
    },
  ];
  return (
    <SpeedDial
      ariaLabel={t("dial.label")}
      sx={{ position: "fixed", bottom: 16, right: 16 }}
      icon={<SpeedDialIcon />}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          onClick={() => router.replace(action.route)}
        />
      ))}
    </SpeedDial>
  );
};
export default Importer;
