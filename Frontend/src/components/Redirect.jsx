// Importações de Bibliotecas e Frameworks
import { Link } from "@mui/material";

export function Redirect({ href }) {
  return (
    <Link
      href={href}
      underline="hover"
      target="_blank"
      sx={{
        fontSize: "13px",
        color: "var(--main-one)",
      }}
    >
      Quer saber mais? Clique e mergulhe no conteúdo original agora mesmo.
    </Link>
  );
}
