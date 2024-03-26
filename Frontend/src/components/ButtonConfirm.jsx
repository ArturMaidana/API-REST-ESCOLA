// Importações de Bibliotecas e Frameworks
import { Button } from "@mui/material";

export function ButtonConfirm({ color, type, onClick, props }) {
  return (
    <Button
      variant="contained"
      color={color}
      type={type}
      onClick={onClick}
      sx={{
        textTransform: "capitalize",
        boxShadow: "none",
        width: "175px",
        "&:hover": {
          boxShadow: "none",
        },
      }}
    >
      {props}
    </Button>
  );
}
