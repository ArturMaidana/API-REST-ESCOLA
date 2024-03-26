// Importações de Bibliotecas e Frameworks
import { Typography } from "@mui/material";

export function PageTitle({ props }) {
  return (
    <Typography
      component="h1"
      variant="h6"
      color="var(--light-one)"
      noWrap
      sx={{ flexGrow: 1, fontWeight: "700" }}
    >
      {props}
    </Typography>
  );
}
