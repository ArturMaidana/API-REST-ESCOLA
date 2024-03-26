// Importações de Bibliotecas e Frameworks
import { Pagination } from "@mui/material";

export function PaginationStyled({ count, page, onChange }) {
  return (
    <Pagination
      count={count}
      shape="rounded"
      page={page}
      onChange={onChange}
      sx={{
        marginTop: "30px",
        display: "flex",
        justifyContent: "center",
      }}
    />
  );
}
