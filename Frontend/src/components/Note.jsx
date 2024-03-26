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
  isContentCurator,
} from "../utils/userUtils";
import { getAllEntities } from "../services/entities";
import { getAllNoteCategories } from "../services/noteCategories";
import { getAllConditions } from "../services/conditions";

export function Note(props) {
  // Estados
  const [userInformation, setUserInformation] = useState(null);
  const [entityList, setEntityList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [conditionList, setConditionList] = useState([]);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatedNoteTitle, setUpdatedNoteTitle] = useState("");
  const [updatedNoteEntity, setUpdatedNoteEntity] = useState("");
  const [updatedNoteCategory, setUpdatedNoteCategory] = useState("");
  const [updatedNoteBody, setUpdatedNoteBody] = useState("");
  const [updatedNoteSource, setUpdatedNoteSource] = useState("");
  const [updatedNoteCondition, setUpdatedNoteCondition] = useState("");
  const [isDeleted, setIsDeleted] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  //
  const openEditModal = () => {
    setIsUpdated(true);
    setUpdatedNoteTitle(props.note.title);
    setUpdatedNoteEntity(props.note.entityId);
    setUpdatedNoteCategory(props.note.categoryId);
    setUpdatedNoteBody(props.note.body);
    setUpdatedNoteSource(props.note.source);
    setUpdatedNoteCondition(props.note.conditionId);
  };
  // Efeito para atualizar os dados da condição quando houver alterações
  useEffect(() => {
    setUpdatedNoteTitle(props.note.title);
    setUpdatedNoteEntity(props.note.entityId);
    setUpdatedNoteCategory(props.note.categoryId);
    setUpdatedNoteBody(props.note.body);
    setUpdatedNoteSource(props.note.source);
    setUpdatedNoteCondition(props.note.conditionId);
  }, [
    props.note.title,
    props.note.entityId,
    props.note.categoryId,
    props.note.body,
    props.note.source,
    props.note.conditionId,
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
    const fetchEntities = async () => {
      try {
        const result = await getAllEntities();
        const entities = result.entities;
        setEntityList(entities);
      } catch (error) {
        console.error(error);
      }
    };
    fetchEntities();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await getAllNoteCategories();
        const categories = result.noteCategories;
        setCategoryList(categories);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
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
  async function editNote(data) {
    try {
      setIsUpdating(true);
      await props.editNote({
        ...data,
        id: props.note.id,
      });
      setIsUpdated(false);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }

  async function removeNote(data) {
    try {
      setIsDeleting(true);
      await props.removeNote({
        ...data,
        id: props.note.id,
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
          <MetadataText props={`ID ${props.note.id}`} />
          <HeaderText props={`${props.note.title}`} />
          <SecondaryText
            props={`${props.note.condition.name} • Por ${props.note.entity.name} • ${props.note.noteCategory.name}`}
          />
          <SupportingText props={`${props.note.body}`} />
          <Redirect href={props.note.source} />
        </CardContent>
        {userInformation &&
          (isSystemCoordinator(userInformation) ||
            isContentCurator(userInformation)) && (
            <CardActions sx={{ ml: 1 }}>
              <ButtonEditItem onClick={openEditModal} />
              <ButtonDeleteItem onClick={() => setIsDeleted(true)} />
            </CardActions>
          )}
      </Card>

      {/* Modal de edição */}
      <Dialog open={isUpdated} onClose={() => setIsUpdated(false)} fullWidth>
        <form onSubmit={handleSubmit(editNote)}>
          <DialogTitle>
            {" "}
            <HeaderText props={"Atualize as Informações do Post"} />
          </DialogTitle>

          <DialogContent>
            <InputTextMultiline
              name={"noteTitle"}
              label={"Título"}
              type={"text"}
              id={"noteTitle"}
              value={updatedNoteTitle}
              error={errors.noteTitle}
              helperText={errors.noteTitle && errors.noteTitle.message}
              onChange={(e) => setUpdatedNoteTitle(e.target.value)}
              inputProps={{
                ...register("noteTitle", {
                  required: {
                    value: true,
                    message:
                      "Parece que você esqueceu de fornecerum título para a nota. Por favor, preencha esse campo.",
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
            >
              <InputLabel id="demo-simple-select-standard-label">
                Workspace
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={updatedNoteEntity}
                label="Workspace"
                onChange={(e) => setUpdatedNoteEntity(e.target.value)}
                inputProps={{
                  ...register("noteEntity", {
                    required: {
                      value: true,
                      message:
                        "Escolha o workspace ao qual deseja vincular esta nota.",
                    },
                  }),
                }}
              >
                {entityList.map((entity) => (
                  <MenuItem value={entity.id} key={entity.id}>
                    {entity.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.noteEntity?.message}</FormHelperText>
            </FormControl>

            {/* Considere criar um componente separado para este trecho de código. */}
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
                Categoria
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={updatedNoteCategory}
                label="Categoria"
                onChange={(e) => setUpdatedNoteCategory(e.target.value)}
                inputProps={{
                  ...register("noteCategory", {
                    required: {
                      value: true,
                      message:
                        "Certifique-se de selecionar a categoria da nota antes de prosseguir.",
                    },
                  }),
                }}
              >
                {categoryList.map((category) => (
                  <MenuItem value={category.id} key={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.noteEntity?.message}</FormHelperText>
            </FormControl>

            <InputTextMultiline
              name={"noteBody"}
              label={"Corpo da Nota"}
              type={"text"}
              id={"noteBody"}
              value={updatedNoteBody}
              error={errors.noteBody}
              helperText={errors.noteBody && errors.noteBody.message}
              onChange={(e) => setUpdatedNoteBody(e.target.value)}
              inputProps={{
                ...register("noteBody", {
                  required: {
                    value: true,
                    message:
                      "O corpo da nota não pode ficar vazio. Por favor, adicione informações.",
                  },
                }),
              }}
            />

            <InputText
              name={"noteSource"}
              label={"Matéria Original"}
              type={"url"}
              id={"noteSource"}
              value={updatedNoteSource}
              error={errors.noteSource}
              helperText={errors.noteSource && errors.noteSource.message}
              onChange={(e) => setUpdatedNoteSource(e.target.value)}
              inputProps={{
                ...register("noteSource", {
                  required: {
                    value: true,
                    message: "Insira um link válido para a matéria da nota.",
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
            >
              <InputLabel id="demo-simple-select-standard-label">
                Condição da Nota
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={updatedNoteCondition}
                label="Condição da Nota"
                onChange={(e) => setUpdatedNoteCondition(e.target.value)}
                inputProps={{
                  ...register("noteCondition", {
                    required: {
                      value: true,
                      message: "Indique se a nota está no ar ou fora do ar.",
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
              <FormHelperText>{errors.noteCondition?.message}</FormHelperText>
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
              onClick={() => removeNote()}
              props={"Sim, desejo apagar"}
            />
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
