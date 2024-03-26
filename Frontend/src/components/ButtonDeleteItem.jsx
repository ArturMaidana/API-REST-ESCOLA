// Importações de Bibliotecas e Frameworks
import { Button } from "@mui/material";

export function ButtonDeleteItem({ onClick }) {
  return (
    <Button
      variant="text"
      size="small"
      onClick={onClick}
      sx={{
        color: "var(--red-one)",
        textTransform: "capitalize",
        "&:hover": {
          backgroundColor: "var(--light-two)",
        },
      }}
    >
      Apagar
    </Button>
  );
}
