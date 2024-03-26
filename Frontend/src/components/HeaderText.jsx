// Importações de Bibliotecas e Frameworks
import { Typography } from "@mui/material";

export function HeaderText({ props }) {
  return (
    <Typography
      variant="h6"
      gutterBottom
      sx={{
        fontSize: "19px",
        fontWeight: "700",
        color: "#828282",
      }}
    >
      {props}
    </Typography>
  );
}
