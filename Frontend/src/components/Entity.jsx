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
import { SecondaryText } from "./SecondaryText";
import { InputText } from "./InputText";
import { InputTextMultiline } from "../components/InputTextMultiline";
import { SupportingText } from "./SupportingText";
import { ContactText } from "./ContactText";
import { Redirect } from "./Redirect";
import { ButtonEditItem } from "./ButtonEditItem";
import { ButtonDeleteItem } from "./ButtonDeleteItem";
import { ButtonCancel } from "./ButtonCancel";
import { ButtonConfirm } from "./ButtonConfirm";
import { CircularProgressButtonStyled } from "../components/CircularProgressButtonStyled";

// Importações de Serviços
import {
  getUserInformation,
  isSystemCoordinator,
  isPartnershipManager,
} from "../utils/userUtils";
import { getAllEntityTypes } from "../services/entityTypes";
import { getAllConditions } from "../services/conditions";

export function Entity(props) {
  // Estados
  const [userInformation, setUserInformation] = useState(null);
  const [entityTypeList, setEntityTypeList] = useState([]);
  const [conditionList, setConditionList] = useState([]);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatedEntityName, setUpdatedEntityName] = useState("");
  const [updatedEntityType, setUpdatedEntityType] = useState("");
  const [updatedEntityDescription, setUpdatedEntityDescription] = useState("");
  const [updatedEntityPhone, setUpdatedEntityPhone] = useState("");
  const [updatedEntityEmail, setUpdatedEntityEmail] = useState("");
  const [updatedEntityWebsite, setUpdatedEntityWebsite] = useState("");
  const [updatedEntityCep, setUpdatedEntityCep] = useState("");
  const [updatedEntityCondition, setUpdatedEntityCondition] = useState("");
  const [isDeleted, setIsDeleted] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  //
  const openEditModal = () => {
    setIsUpdated(true);
    setUpdatedEntityName(props.entity.name);
    setUpdatedEntityType(props.entity.entityTypeId);
    setUpdatedEntityDescription(props.entity.description);
    setUpdatedEntityPhone(props.entity.phone);
    setUpdatedEntityEmail(props.entity.email);
    setUpdatedEntityWebsite(props.entity.website);
    setUpdatedEntityCep(props.entity.cep);
    setUpdatedEntityCondition(props.entity.conditionId);
  };
  // Efeito para atualizar os dados da condição quando houver alterações
  useEffect(() => {
    setUpdatedEntityName(props.entity.name);
    setUpdatedEntityType(props.entity.entityTypeId);
    setUpdatedEntityDescription(props.entity.description);
    setUpdatedEntityPhone(props.entity.phone);
    setUpdatedEntityEmail(props.entity.email);
    setUpdatedEntityWebsite(props.entity.website);
    setUpdatedEntityCep(props.entity.cep);
    setUpdatedEntityCondition(props.entity.conditionId);
  }, [
    props.entity.name,
    props.entity.entityTypeId,
    props.entity.description,
    props.entity.phone,
    props.entity.email,
    props.entity.website,
    props.entity.cep,
    props.entity.conditionId,
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
    const fetchEntityTypes = async () => {
      try {
        const result = await getAllEntityTypes();
        const entityTypes = result.entityTypes;
        setEntityTypeList(entityTypes);
      } catch (error) {
        console.error(error);
      }
    };
    fetchEntityTypes();
  }, []);

  useEffect(() => {
    const fetchConditions = async () => {
      try {
        const result = await getAllConditions();
        const conditions = result.conditions;
        setConditionList(conditions);
      } catch (error) {
        console.error(error);
      }
    };
    fetchConditions();
  }, []);

  // Hooks de formulário para validação
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  // Funções assíncronas
  async function editEntity(data) {
    try {
      setIsUpdating(true);
      await props.editEntity({
        ...data,
        id: props.entity.id,
      });
      setIsUpdated(false);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }

  async function removeEntity(data) {
    try {
      setIsDeleting(true);
      await props.removeEntity({
        ...data,
        id: props.entity.id,
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
          <MetadataText props={`ID ${props.entity.id}`} />
          <HeaderText props={`${props.entity.name}`} />
          <SecondaryText
            props={`${props.entity.condition.name} • Em ${props.entity.city} - ${props.entity.state} • ${props.entity.entityType.name}`}
          />
          <SupportingText props={`${props.entity.description}`} />
          <ContactText
            props={`Este workspace está localizado no Bairro ${props.entity.neighborhood}, na ${props.entity.avenue}. Fique à vontade para entrar em contato pelo telefone ${props.entity.phone} ou via e-mail em ${props.entity.email}`}
          />
          <Redirect href={props.entity.website} />
        </CardContent>
        {userInformation &&
          (isSystemCoordinator(userInformation) ||
            isPartnershipManager(userInformation)) && (
            <CardActions sx={{ ml: 1 }}>
              <ButtonEditItem onClick={openEditModal} />
              <ButtonDeleteItem onClick={() => setIsDeleted(true)} />
            </CardActions>
          )}
      </Card>

      {/* Modal de edição */}
      <Dialog open={isUpdated} onClose={() => setIsUpdated(false)} fullWidth>
        <form onSubmit={handleSubmit(editEntity)}>
          <DialogTitle>
            {" "}
            <HeaderText props={"Atualize as Informações do Post"} />
          </DialogTitle>

          <DialogContent>
            <InputTextMultiline
              name={"entityName"}
              label={"Nome"}
              type={"text"}
              id={"entityName"}
              value={updatedEntityName}
              error={errors.entityName}
              helperText={errors.entityName && errors.entityName.message}
              onChange={(e) => setUpdatedEntityName(e.target.value)}
              inputProps={{
                ...register("entityName", {
                  required: {
                    value: true,
                    message:
                      "Parece que você esqueceu de fornecer o nome do workspace. Por favor, preencha esse campo.",
                  },
                }),
              }}
            />

            {/* Considere criar um componente separado para este trecho de código. */}
            <FormControl
              fullWidth
              variant="standard"
              sx={{
                marginTop: "15px",
                marginBottom: "15px",
                minWidth: 120,
              }}
              error={!!errors.entityType}
            >
              <InputLabel id="demo-simple-select-standard-label">
                Tipo do Workspace
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={updatedEntityType}
                label="Tipo do Workspace"
                onChange={(e) => setUpdatedEntityType(e.target.value)}
                inputProps={{
                  ...register("entityType", {
                    required: {
                      value: true,
                      message:
                        "Certifique-se de selecionar o tipo do workspace antes de prosseguir.",
                    },
                  }),
                }}
              >
                {entityTypeList.map((entityType) => (
                  <MenuItem value={entityType.id} key={entityType.id}>
                    {entityType.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.entityType?.message}</FormHelperText>
            </FormControl>

            <InputTextMultiline
              name={"entityDescription"}
              label={"Descrição"}
              type={"text"}
              id={"entityDescription"}
              value={updatedEntityDescription}
              onChange={(e) => setUpdatedEntityDescription(e.target.value)}
              inputProps={{
                ...register("entityDescription"),
              }}
            />

            <InputText
              name={"entityPhone"}
              label={"Telefone"}
              type={"text"}
              id={"entityPhone"}
              value={updatedEntityPhone}
              onChange={(e) => setUpdatedEntityPhone(e.target.value)}
              inputProps={{
                ...register("entityPhone"),
              }}
            />

            <InputText
              name={"entityEmail"}
              label={"Email de Contato"}
              type={"email"}
              id={"entityEmail"}
              value={updatedEntityEmail}
              error={errors.entityEmail}
              helperText={errors.entityEmail && errors.entityEmail.message}
              onChange={(e) => setUpdatedEntityEmail(e.target.value)}
              inputProps={{
                ...register("entityEmail", {
                  required: {
                    value: true,
                    message:
                      "Insira um e-mail válido para possibilitar que outras pessoas entrem em contato.",
                  },
                }),
              }}
            />

            <InputText
              name={"entityWebsite"}
              label={"Website"}
              type={"url"}
              id={"entityWebsite"}
              value={updatedEntityWebsite}
              onChange={(e) => setUpdatedEntityWebsite(e.target.value)}
              inputProps={{
                ...register("entityWebsite"),
              }}
            />

            <InputText
              name={"entityCep"}
              label={"CEP"}
              type={"text"}
              id={"entityCep"}
              value={updatedEntityCep}
              error={errors.entityCep}
              helperText={errors.entityCep && errors.entityCep.message}
              onChange={(e) => setUpdatedEntityCep(e.target.value)}
              inputProps={{
                ...register("entityCep", {
                  required: {
                    value: true,
                    message:
                      "Parece que o campo de CEP está vazio ou contém informações inválidas. Insira um CEP válido.",
                  },
                }),
              }}
            />

            {/* Considere criar um componente separado para este trecho de código. */}
            <FormControl
              fullWidth
              variant="standard"
              sx={{
                marginTop: "15px",
                marginBottom: "15px",
                minWidth: 120,
              }}
              error={!!errors.entityCondition}
            >
              <InputLabel id="demo-simple-select-standard-label">
                Condição do Workspace
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={updatedEntityCondition}
                label="Condição do Workspace"
                onChange={(e) => setUpdatedEntityCondition(e.target.value)}
                inputProps={{
                  ...register("entityCondition", {
                    required: {
                      value: true,
                      message:
                        "Indique se o workspace está no ar ou fora do ar.",
                    },
                  }),
                }}
              >
                {conditionList.map((condition) => (
                  <MenuItem value={condition.id} key={condition.id}>
                    {condition.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.entityCondition?.message}</FormHelperText>
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
              onClick={() => removeEntity()}
              props={"Sim, desejo apagar"}
            />
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
