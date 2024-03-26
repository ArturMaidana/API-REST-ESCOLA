// Importações de Bibliotecas e Frameworks
import { Button } from "@mui/material";

export function ButtonEditItem({ onClick }) {
  return (
    <Button
      variant="text"
      size="small"
      onClick={onClick}
      sx={{
        textTransform: "capitalize",
        "&:hover": {
          backgroundColor: "var(--light-two)",
        },
      }}
    >
      Editar
    </Button>
  );
}
