// Importações de Bibliotecas e Frameworks
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

// Importações de Componentes
import { MetadataText } from "./MetadataText";
import { HeaderText } from "./HeaderText";
import { InputText } from "./InputText";
import { ButtonEditItem } from "./ButtonEditItem";
import { ButtonDeleteItem } from "./ButtonDeleteItem";
import { ButtonCancel } from "./ButtonCancel";
import { ButtonConfirm } from "./ButtonConfirm";
import { CircularProgressButtonStyled } from "../components/CircularProgressButtonStyled";

// Importações de Serviços
import { getUserInformation, isSystemCoordinator } from "../utils/userUtils";

export function Condition(props) {
  // Estados
  const [userInformation, setUserInformation] = useState(null);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatedConditionName, setUpdatedConditionName] = useState("");
  const [isDeleted, setIsDeleted] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  //
  const openEditModal = () => {
    setIsUpdated(true);
    setUpdatedConditionName(props.condition.name);
  };
  // Efeito para atualizar os dados da condição quando houver alterações
  useEffect(() => {
    setUpdatedConditionName(props.condition.name);
  }, [props.condition.name]);

  //
  useEffect(() => {
    async function fetchUserInformation() {
      const result = await getUserInformation();
      setUserInformation(result);
    }
    fetchUserInformation();
  }, []);

  // Hooks de formulário para validação
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  // Funções assíncronas
  async function editCondition(data) {
    try {
      setIsUpdating(true);
      await props.editCondition({
        ...data,
        id: props.condition.id,
      });
      setIsUpdated(false);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }

  async function removeCondition(data) {
    try {
      setIsDeleting(true);
      await props.removeCondition({
        ...data,
        id: props.condition.id,
      });
      setIsDeleted(false);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <Card sx={{ minWidth: 275, mb: 2, p: 1 }}>
        <CardContent>
          <MetadataText props={`ID ${props.condition.id}`} />
          <HeaderText props={props.condition.name} />
        </CardContent>
        {userInformation && isSystemCoordinator(userInformation) && (
          <CardActions sx={{ ml: 1 }}>
            <ButtonEditItem onClick={openEditModal} />
            <ButtonDeleteItem onClick={() => setIsDeleted(true)} />
          </CardActions>
        )}
      </Card>

      {/* Modal de edição */}
      <Dialog open={isUpdated} onClose={() => setIsUpdated(false)} fullWidth>
        <form onSubmit={handleSubmit(editCondition)}>
          <DialogTitle>
            {" "}
            <HeaderText
              props={`Ajustar detalhes de "${props.condition.name}"`}
            />
          </DialogTitle>

          <DialogContent>
            <InputText
              name={"conditionName"}
              label={"Nome"}
              type={"text"}
              id={"conditionName"}
              value={updatedConditionName}
              error={errors.conditionName}
              helperText={errors.conditionName && errors.conditionName.message}
              onChange={(e) => setUpdatedConditionName(e.target.value)}
              inputProps={{
                ...register("conditionName", {
                  required: {
                    value: true,
                    message: "Informe um nome para a condição.",
                  },
                }),
              }}
            />
          </DialogContent>

          <DialogActions sx={{ mb: 3, mr: 2 }}>
            <ButtonCancel onClick={() => setIsUpdated(false)} />
            {isUpdating ? (
              <ButtonConfirm props={<CircularProgressButtonStyled />} />
            ) : (
              <ButtonConfirm type={"submit"} props={"Atualizar Informações"} />
            )}
          </DialogActions>
        </form>
      </Dialog>

      {/* Modal confirmando a deleção do dado */}
      <Dialog
        open={isDeleted}
        onClose={() => setIsDeleted(false)}
        maxWidth="xs"
        sx={{ textAlign: "center" }}
      >
        <DialogTitle>Você tem certeza?</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Você realmente deseja excluir este dado? Esse processo não pode ser
            desfeito.
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ mb: 3, justifyContent: "center" }}>
          <ButtonCancel
            onClick={() => setIsDeleted(false)}
            props={"Não, quero cancelar"}
          />

          {isDeleting ? (
            <ButtonConfirm
              color={"error"}
              props={<CircularProgressButtonStyled />}
            />
          ) : (
            <ButtonConfirm
              color={"error"}
              type={"submit"}
              onClick={() => removeCondition()}
              props={"Sim, desejo apagar"}
            />
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
