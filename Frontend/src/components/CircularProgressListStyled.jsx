// Importações de Bibliotecas e Frameworks
import { Box, CircularProgress } from "@mui/material";

export function CircularProgressListStyled() {
  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <CircularProgress sx={{ color: "var(--main-one)" }} />
    </Box>
  );
}
