// Importações de Bibliotecas e Frameworks
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card, CardActions, CardContent, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";

// Importações de Componentes
import { MetadataText } from "./MetadataText";
import { HeaderText } from "./HeaderText";
import { SupportingText } from "./SupportingText";
import { InputText } from "./InputText";
import { InputTextMultiline } from "../components/InputTextMultiline";
import { ButtonEditItem } from "./ButtonEditItem";
import { ButtonDeleteItem } from "./ButtonDeleteItem";
import { ButtonCancel } from "./ButtonCancel";
import { ButtonConfirm } from "./ButtonConfirm";
import { CircularProgressButtonStyled } from "../components/CircularProgressButtonStyled";

// Importações de Serviços
import { getUserInformation, isSystemCoordinator } from "../utils/userUtils";

export function Role(props) {
  // Estados
  const [userInformation, setUserInformation] = useState(null);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatedRoleName, setUpdatedRoleName] = useState("");
  const [updatedRoleDescription, setUpdatedRoleDescription] = useState("");
  const [isDeleted, setIsDeleted] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  //
  const openEditModal = () => {
    setIsUpdated(true);
    setUpdatedRoleName(props.role.name);
    setUpdatedRoleDescription(props.role.description);
  };
  // Efeito para atualizar os dados do cargo quando houver alterações
  useEffect(() => {
    setUpdatedRoleName(props.role.name);
    setUpdatedRoleDescription(props.role.description);
  }, [props.role.name, props.role.description]);

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
  async function editRole(data) {
    try {
      setIsUpdating(true);
      await props.editRole({
        ...data,
        id: props.role.id,
      });
      setIsUpdated(false);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }

  async function removeRole(data) {
    try {
      setIsDeleting(true);
      await props.removeRole({
        ...data,
        id: props.role.id,
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
          <MetadataText props={`ID ${props.role.id}`} />
          <HeaderText props={props.role.name} />
          <SupportingText props={props.role.description} />
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
        <form onSubmit={handleSubmit(editRole)}>
          <DialogTitle>
            {" "}
            <HeaderText props={`Ajustar detalhes de "${props.role.name}"`} />
          </DialogTitle>

          <DialogContent>
            <InputText
              name={"roleName"}
              label={"Nome"}
              type={"text"}
              id={"roleName"}
              value={updatedRoleName}
              error={errors.roleName}
              helperText={errors.roleName && errors.roleName.message}
              onChange={(e) => setUpdatedRoleName(e.target.value)}
              inputProps={{
                ...register("roleName", {
                  required: {
                    value: true,
                    message: "Informe um nome para o cargo.",
                  },
                }),
              }}
            />

            <InputTextMultiline
              name={"roleDescription"}
              label={"Nome"}
              type={"text"}
              id={"roleDescription"}
              value={updatedRoleDescription}
              onChange={(e) => setUpdatedRoleDescription(e.target.value)}
              inputProps={{
                ...register("roleDescription"),
              }}
            />
          </DialogContent>

          <DialogActions sx={{ mb: 3, mr: 2 }}>
            <ButtonCancel onClick={() => setIsUpdated(false)} />
            {isUpdating ? <ButtonConfirm props={<CircularProgressButtonStyled />} /> : <ButtonConfirm type={"submit"} props={"Atualizar Informações"} />}
          </DialogActions>
        </form>
      </Dialog>

      {/* Modal confirmando a deleção do dado */}
      <Dialog open={isDeleted} onClose={() => setIsDeleted(false)} maxWidth="xs" sx={{ textAlign: "center" }}>
        <DialogTitle>Você tem certeza?</DialogTitle>

        <DialogContent>
          <DialogContentText>Você realmente deseja excluir este dado? Esse processo não pode ser desfeito.</DialogContentText>
        </DialogContent>

        <DialogActions sx={{ mb: 3, justifyContent: "center" }}>
          <ButtonCancel onClick={() => setIsDeleted(false)} props={"Não, quero cancelar"} />

          {isDeleting ? (
            <ButtonConfirm color={"error"} props={<CircularProgressButtonStyled />} />
          ) : (
            <ButtonConfirm color={"error"} type={"submit"} onClick={() => removeRole()} props={"Sim, desejo apagar"} />
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
