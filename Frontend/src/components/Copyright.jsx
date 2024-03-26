// Importações de Bibliotecas e Frameworks
import { Typography, Link } from "@mui/material";

export function Copyright(props) {
  return (
    <Typography variant="body2" color="var(--dark-three)" align="center" {...props}>
      {"Desenvolvido com ♥ por "}
      <Link style={{ textDecoration: "none", color: "inherit" }} href="https://colatte.io/" target="_blank" rel="noopener noreferrer">
        Atlas
      </Link>
    </Typography>
  );
}
