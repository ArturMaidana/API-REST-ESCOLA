// Importações de Bibliotecas e Frameworks
import { Typography } from "@mui/material";

export function MetadataText({ props }) {
  return (
    <Typography
      variant="subtitle2"
      gutterBottom
      sx={{
        fontSize: "12px",
        color: "var(--dark-three)",
        fontWeight: "400",
      }}
    >
      {props}
    </Typography>
  );
}
