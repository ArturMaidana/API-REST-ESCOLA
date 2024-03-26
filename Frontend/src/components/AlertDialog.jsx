// Importações de Bibliotecas e Frameworks
import * as React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

// Importações de Componentes
import { HeaderText } from "./HeaderText";

export function AlertDialog(props) {
  return (
    <React.Fragment>
      <Dialog
        open={props.show}
        onClose={props.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {" "}
          <HeaderText props={props.title} />
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {props.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="text"
            onClick={props.handleClose}
            sx={{
              textTransform: "capitalize",
              "&:hover": {
                backgroundColor: "var(--light-two)",
              },
            }}
          >
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
