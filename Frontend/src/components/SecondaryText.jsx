// Importações de Bibliotecas e Frameworks
import { Typography } from "@mui/material";

export function SecondaryText({ props }) {
  return (
    <Typography
      variant="subtitle2"
      gutterBottom
      sx={{
        fontSize: "13px",
        color: "#828282",
        fontWeight: "400",
        margin: "5px 0 10px 0",
      }}
    >
      {props}
    </Typography>
  );
}
