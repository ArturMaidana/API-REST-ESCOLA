// Importações de Bibliotecas e Frameworks
import { Typography } from "@mui/material";

export function ContactText({ props }) {
  return (
    <Typography
      variant="body2"
      gutterBottom
      sx={{
        fontSize: "13px",
        color: "var(--dark-two)",
        margin: "10px 0",
      }}
    >
      {props}
    </Typography>
  );
}
