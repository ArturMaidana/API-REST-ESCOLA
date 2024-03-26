// Importações de Bibliotecas e Frameworks
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  CssBaseline,
  Drawer as MuiDrawer,
  Box,
  AppBar as MuiAppBar,
  Toolbar,
  List,
  Divider,
  IconButton,
  Badge,
  Container,
  styled,
  createTheme,
  ThemeProvider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  FormHelperText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

// Importações de Componentes
import {
  mainListItems,
  secondaryListItems,
  tertiaryListItems,
} from "../components/ListItems";
import { PageTitle } from "../components/PageTitle";
import { AccountMenu } from "../components/AccountMenu";
import { AlertDialog } from "../components/AlertDialog";
import { ButtonCreateItem } from "../components/ButtonCreateItem";
import { HeaderText } from "../components/HeaderText";
import { InputText } from "../components/InputText";
import { InputTextMultiline } from "../components/InputTextMultiline";
import { ButtonCancel } from "../components/ButtonCancel";
import { ButtonConfirm } from "../components/ButtonConfirm";
import { CircularProgressButtonStyled } from "../components/CircularProgressButtonStyled";
import { CircularProgressListStyled } from "../components/CircularProgressListStyled";
import { PaginationStyled } from "../components/PaginationStyled";
import { Copyright } from "../components/Copyright";
import { Note } from "../components/Note";

// Importações de Serviços
import {
  getUserInformation,
  isSystemCoordinator,
  isContentCurator,
} from "../utils/userUtils";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../services/notes";
import { getAllEntities } from "../services/entities";
import { getAllNoteCategories } from "../services/noteCategories";
import { getAllConditions } from "../services/conditions";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export function Notes() {
  // Estados
  const [open, setOpen] = React.useState(false);
  const [result, setResult] = useState(null);
  const [userInformation, setUserInformation] = useState(null);
  const [notes, setNotes] = useState([]);
  const [entityList, setEntityList] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [conditionList, setConditionList] = useState([]);
  const [selectedCondition, setSelectedCondition] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  // eslint-disable-next-line
  const [pageSize, setPageSize] = useState(10);

  //
  const toggleDrawer = () => {
    setOpen(!open);
  };

  //
  useEffect(() => {
    async function fetchUserInformation() {
      const result = await getUserInformation();
      setUserInformation(result);
    }
    fetchUserInformation();
  }, []);

  useEffect(() => {
    findNotes();
  }, [currentPage, pageSize]);

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
  async function findNotes() {
    try {
      setIsSearching(true);
      const result = await getNotes(currentPage, pageSize);
      setNotes(result.notes);
      setTotalPages(result.totalPages);
      setCurrentPage(result.currentPage);
    } catch (error) {
      setResult({
        title: "Uh, oh!",
        message:
          error.response?.data?.error ||
          "Por favor, informe-nos sobre este erro para que possamos resolvê-lo. Se precisar de assistência imediata, entre em contato conosco. Pedimos desculpas pelo inconveniente e agradecemos pela sua colaboração!",
      });
    } finally {
      setIsSearching(false);
    }
  }

  async function addNote(data) {
    try {
      setIsCreating(true);
      await createNote(data);
      setIsCreated(false);
      setResult({
        title: "Wohoo, Sucesso!",
        message: "Nota criada com sucesso.",
      });
      await findNotes();
    } catch (error) {
      setResult({
        title: "Uh, oh!",
        message:
          error.response?.data?.error ||
          "Por favor, informe-nos sobre este erro para que possamos resolvê-lo. Se precisar de assistência imediata, entre em contato conosco. Pedimos desculpas pelo inconveniente e agradecemos pela sua colaboração!",
      });
    } finally {
      setIsCreating(false);
    }
  }

  async function editNote(data) {
    try {
      await updateNote(data);
      setResult({
        title: "Wohoo, Feito!",
        message: "Nota atualizada com sucesso.",
      });
      await findNotes();
    } catch (error) {
      setResult({
        title: "Uh, oh!",
        message:
          error.response?.data?.error ||
          "Por favor, informe-nos sobre este erro para que possamos resolvê-lo. Se precisar de assistência imediata, entre em contato conosco. Pedimos desculpas pelo inconveniente e agradecemos pela sua colaboração!",
      });
    }
  }

  async function removeNote(data) {
    try {
      await deleteNote(data);
      setResult({
        title: "Wohoo, Concluído!",
        message: "Nota deletada com sucesso.",
      });
      await findNotes();
    } catch (error) {
      setResult({
        title: "Uh, oh!",
        message:
          error.response?.data?.error ||
          "Por favor, informe-nos sobre este erro para que possamos resolvê-lo. Se precisar de assistência imediata, entre em contato conosco. Pedimos desculpas pelo inconveniente e agradecemos pela sua colaboração!",
      });
    }
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <AlertDialog
        show={result}
        title={result?.title}
        message={result?.message}
        handleClose={() => setResult(null)}
      />

      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          position="absolute"
          open={open}
          sx={{ background: "var(--main-one)" }}
        >
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <PageTitle props={"Notas"} />
            <IconButton color="inherit">
              <Badge color="secondary">
                <AccountMenu />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <List component="nav">
            {mainListItems}
            <Divider sx={{ my: 1 }} />
            {secondaryListItems}
            <Divider sx={{ my: 1 }} />
            {tertiaryListItems}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/*  */}
            {userInformation &&
              (isSystemCoordinator(userInformation) ||
                isContentCurator(userInformation)) && (
                <ButtonCreateItem onClick={() => setIsCreated(true)} />
              )}

            {/* TODO Filtro */}

            {/*  */}
            {isSearching ? (
              <CircularProgressListStyled />
            ) : (
              <Box>
                {notes.length > 0 ? (
                  notes.map((note, index, userInformation) => (
                    <Note
                      key={index}
                      note={note}
                      editNote={editNote}
                      removeNote={removeNote}
                      userInformation={userInformation}
                    />
                  ))
                ) : (
                  <p className="text-center">
                    No momento ainda não existe nenhum dado para a categoria
                    selecionada.
                  </p>
                )}

                {/* Paginação */}
                <PaginationStyled
                  count={totalPages}
                  page={currentPage}
                  onChange={(event, page) => setCurrentPage(page)}
                />
              </Box>
            )}

            {/* Modal de criação. O ideal seria componentizar, pois é parecido com o modal de editar */}
            <Dialog
              open={isCreated}
              onClose={() => setIsCreated(false)}
              fullWidth
            >
              <form onSubmit={handleSubmit(addNote)}>
                <DialogTitle>
                  {" "}
                  <HeaderText props={"Novo Registro de Dados"} />
                </DialogTitle>

                <DialogContent>
                  <InputTextMultiline
                    name={"noteTitle"}
                    label={"Título"}
                    type={"text"}
                    id={"noteTitle"}
                    error={errors.noteTitle}
                    helperText={errors.noteTitle && errors.noteTitle.message}
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
                    error={!!errors.noteEntity}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      Workspace
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={selectedEntity}
                      label="Workspace"
                      onChange={(e) => setSelectedEntity(e.target.value)}
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
                    <FormHelperText>
                      {errors.noteEntity?.message}
                    </FormHelperText>
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
                    error={!!errors.noteCategory}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      Categoria
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={selectedCategory}
                      label="Categoria"
                      onChange={(e) => setSelectedCategory(e.target.value)}
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
                    <FormHelperText>
                      {errors.noteCategory?.message}
                    </FormHelperText>
                  </FormControl>

                  <InputTextMultiline
                    name={"noteBody"}
                    label={"Corpo da Nota"}
                    type={"text"}
                    id={"noteBody"}
                    error={errors.noteBody}
                    helperText={errors.noteBody && errors.noteBody.message}
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
                    error={errors.noteSource}
                    helperText={errors.noteSource && errors.noteSource.message}
                    inputProps={{
                      ...register("noteSource", {
                        required: {
                          value: true,
                          message:
                            "Insira um link válido para a matéria da nota.",
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
                    error={!!errors.noteCondition}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      Condição da Nota
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={selectedCondition}
                      label="Condição da Nota"
                      onChange={(e) => setSelectedCondition(e.target.value)}
                      inputProps={{
                        ...register("noteCondition", {
                          required: {
                            value: true,
                            message:
                              "Indique se a nota está no ar ou fora do ar.",
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
                    <FormHelperText>
                      {errors.noteCondition?.message}
                    </FormHelperText>
                  </FormControl>
                </DialogContent>

                <DialogActions sx={{ mb: 3, mr: 2 }}>
                  <ButtonCancel onClick={() => setIsCreated(false)} />
                  {isCreating ? (
                    <ButtonConfirm props={<CircularProgressButtonStyled />} />
                  ) : (
                    <ButtonConfirm
                      type={"submit"}
                      props={"Adicionar à Lista"}
                    />
                  )}
                </DialogActions>
              </form>
            </Dialog>

            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
