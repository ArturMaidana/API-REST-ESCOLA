// Importações de Bibliotecas e Frameworks
import { Button } from "@mui/material";

export function ButtonCreateItem({ onClick }) {
  return (
    <Button
      variant="text"
      size="small"
      onClick={onClick}
      sx={{
        marginBottom: "30px",
        textTransform: "capitalize",
        padding: "10px",
        "&:hover": {
          backgroundColor: "var(--light-two)",
        },
      }}
    >
      Criar novo item
    </Button>
  );
}
