// Importações de Bibliotecas e Frameworks
import { TextField } from "@mui/material";

export function InputSearch({ value, onChange }) {
  return (
    <TextField
      fullWidth
      label="Pesquisar"
      variant="filled"
      sx={{ marginTop: "30px", marginBottom: "30px" }}
      value={value}
      onChange={onChange}
    />
  );
}
