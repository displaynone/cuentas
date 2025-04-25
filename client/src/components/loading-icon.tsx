import { keyframes } from "@emotion/react";
import { alpha, styled } from "@mui/material/styles";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const LoadingIcon = styled("div")(({ theme }) => ({
  width: "12px",
  height: "12px",
  border: `2px solid ${alpha(theme.palette.grey[300], 0.3)}`,
  borderTop: `2px solid ${alpha(theme.palette.grey[300], 0.7)}`,
  borderRadius: "50%",
  animation: `${spin} 1s linear infinite`,
}));
