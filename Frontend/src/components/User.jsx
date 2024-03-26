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
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  FormHelperText,
} from "@mui/material";

// Importações de Componentes
import { MetadataText } from "./MetadataText";
import { HeaderText } from "./HeaderText";
import { InputText } from "./InputText";
import { SecondaryText } from "./SecondaryText";
import { SupportingText } from "./SupportingText";
import { ButtonEditItem } from "./ButtonEditItem";
import { ButtonDeleteItem } from "./ButtonDeleteItem";
import { ButtonCancel } from "./ButtonCancel";
import { ButtonConfirm } from "./ButtonConfirm";
import { CircularProgressButtonStyled } from "../components/CircularProgressButtonStyled";

// Importações de Serviços
import { getUserInformation, isSystemCoordinator } from "../utils/userUtils";
import { getAllRoles } from "../services/roles";

export function User(props) {
  // Estados
  const [userInformation, setUserInformation] = useState(null);
  const [roleList, setRoleList] = useState([]);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatedUserName, setUpdatedUserName] = useState("");
  const [updatedUserEmail, setUpdatedUserEmail] = useState("");
  // eslint-disable-next-line
  const [updatedUserPassword, setUpdatedUserPassword] = useState("");
  const [updatedUserRole, setUpdatedUserRole] = useState("");
  const [isDeleted, setIsDeleted] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  //
  const openEditModal = () => {
    setIsUpdated(true);
    setUpdatedUserName(props.user.name);
    setUpdatedUserEmail(props.user.email);
    setUpdatedUserPassword(props.user.password);
    setUpdatedUserRole(props.user.roleId);
  };
  // Efeito para atualizar os dados da condição quando houver alterações
  useEffect(() => {
    setUpdatedUserName(props.user.name);
    setUpdatedUserEmail(props.user.email);
    setUpdatedUserPassword(props.user.password);
    setUpdatedUserRole(props.user.roleId);
  }, [
    props.user.name,
    props.user.email,
    props.user.password,
    props.user.roleId,
  ]);

  //
  useEffect(() => {
    async function fetchUserInformation() {
      const result = await getUserInformation();
      setUserInformation(result);
    }
    fetchUserInformation();
  }, []);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const result = await getAllRoles();
        const roles = result.roles;
        setRoleList(roles);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRoles();
  }, []);

  // Hooks de formulário para validação
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  // Funções assíncronas
  async function editUser(data) {
    try {
      setIsUpdating(true);
      await props.editUser({
        ...data,
        id: props.user.id,
      });
      setIsUpdated(false);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }

  async function removeUser(data) {
    try {
      setIsDeleting(true);
      await props.removeUser({
        ...data,
        id: props.user.id,
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
          <MetadataText props={`ID ${props.user.id}`} />
          <HeaderText props={props.user.name} />
          {userInformation && isSystemCoordinator(userInformation) && (
            <SecondaryText props={`${props.user.email}`} />
          )}
          <SupportingText
            props={`Este usuário ocupa o cargo de "${props.user.role.name}".`}
          />
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
        <form onSubmit={handleSubmit(editUser)}>
          <DialogTitle>
            {" "}
            <HeaderText props={`Ajustar detalhes de "${props.user.name}"`} />
          </DialogTitle>

          <DialogContent>
            <InputText
              name={"userName"}
              label={"Nome"}
              type={"text"}
              id={"userName"}
              value={updatedUserName}
              error={errors.userName}
              helperText={errors.userName && errors.userName.message}
              onChange={(e) => setUpdatedUserName(e.target.value)}
              inputProps={{
                ...register("userName", {
                  required: {
                    value: true,
                    message: "Informe um nome para o usuário.",
                  },
                }),
              }}
            />

            <InputText
              name={"userEmail"}
              label={"Endereço de Email"}
              type={"email"}
              id={"userEmail"}
              value={updatedUserEmail}
              error={errors.userEmail}
              helperText={errors.userEmail && errors.userEmail.message}
              onChange={(e) => setUpdatedUserEmail(e.target.value)}
              inputProps={{
                ...register("userEmail", {
                  required: {
                    value: true,
                    message:
                      "Parece que você esqueceu de preencher o campo de e-mail.",
                  },
                }),
              }}
            />

            <InputText
              name={"userPassword"}
              label={"Senha"}
              type={"password"}
              id={"userPassword"}
              onChange={(e) => setUpdatedUserPassword(e.target.value)}
              inputProps={{
                ...register("userPassword"),
              }}
            />

            {/* O ideal para o trecho abaixo seria componentizá-lo */}
            <FormControl
              fullWidth
              variant="standard"
              sx={{
                marginTop: "15px",
                marginBottom: "15px",
                minWidth: 120,
              }}
            >
              <InputLabel id="demo-simple-select-standard-label">
                Cargo
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={updatedUserRole}
                label="Cargo"
                onChange={(e) => setUpdatedUserRole(e.target.value)}
                inputProps={{
                  ...register("userRole", {
                    required: {
                      value: true,
                      message: "Escolha um cargo para o usuário.",
                    },
                  }),
                }}
              >
                {roleList.map((role) => (
                  <MenuItem value={role.id} key={role.id}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.userRole?.message}</FormHelperText>
            </FormControl>
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
              onClick={() => removeUser()}
              props={"Sim, desejo apagar"}
            />
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
