// Importações de Bibliotecas e Frameworks
import { Button } from "@mui/material";

export function ButtonCancel({ onClick, props = "Cancelar" }) {
  return (
    <Button
      variant="text"
      onClick={onClick}
      sx={{
        textTransform: "capitalize",
        "&:hover": {
          backgroundColor: "var(--light-two)",
        },
      }}
    >
      {props}
    </Button>
  );
}
