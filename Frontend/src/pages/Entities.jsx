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
import { Entity } from "../components/Entity";

// Importações de Serviços
import {
  getUserInformation,
  isSystemCoordinator,
  isPartnershipManager,
} from "../utils/userUtils";
import {
  getEntities,
  createEntity,
  updateEntity,
  deleteEntity,
} from "../services/entities";
import { getAllEntityTypes } from "../services/entityTypes";
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

export function Entities() {
  // Estados
  const [open, setOpen] = React.useState(false);
  const [result, setResult] = useState(null);
  const [userInformation, setUserInformation] = useState(null);
  const [entities, setEntities] = useState([]);
  const [typeList, setTypeList] = useState([]);
  const [selectedType, setSelectedType] = useState("");
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
    findEntities();
  }, [currentPage, pageSize]);

  useEffect(() => {
    const fetchEntityTypes = async () => {
      try {
        const result = await getAllEntityTypes();
        const entityTypes = result.entityTypes;
        setTypeList(entityTypes);
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
  async function findEntities() {
    try {
      setIsSearching(true);
      const result = await getEntities(currentPage, pageSize);
      setEntities(result.entities);
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

  async function addEntity(data) {
    try {
      setIsCreating(true);
      await createEntity(data);
      setIsCreated(false);
      setResult({
        title: "Wohoo, Sucesso!",
        message: "Workspace criado com sucesso.",
      });
      await findEntities();
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

  async function editEntity(data) {
    try {
      await updateEntity(data);
      setResult({
        title: "Wohoo, Feito!",
        message: "Workspace atualizado com sucesso.",
      });
      await findEntities();
    } catch (error) {
      setResult({
        title: "Uh, oh!",
        message:
          error.response?.data?.error ||
          "Por favor, informe-nos sobre este erro para que possamos resolvê-lo. Se precisar de assistência imediata, entre em contato conosco. Pedimos desculpas pelo inconveniente e agradecemos pela sua colaboração!",
      });
    }
  }

  async function removeEntity(data) {
    try {
      await deleteEntity(data);
      setResult({
        title: "Wohoo, Concluído!",
        message: "Workspace deletado com sucesso.",
      });
      await findEntities();
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
            <PageTitle props={"Workspaces"} />
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
                isPartnershipManager(userInformation)) && (
                <ButtonCreateItem onClick={() => setIsCreated(true)} />
              )}

            {/* TODO Filtro */}

            {/*  */}
            {isSearching ? (
              <CircularProgressListStyled />
            ) : (
              <Box>
                {entities.length > 0 ? (
                  entities.map((entity, index) => (
                    <Entity
                      key={index}
                      entity={entity}
                      editEntity={editEntity}
                      removeEntity={removeEntity}
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
              <form onSubmit={handleSubmit(addEntity)}>
                <DialogTitle>
                  {" "}
                  <HeaderText props={"Novo Registro de Dados"} />
                </DialogTitle>

                <DialogContent>
                  <InputTextMultiline
                    name={"entityName"}
                    label={"Nome"}
                    type={"text"}
                    id={"entityName"}
                    error={errors.entityName}
                    helperText={errors.entityName && errors.entityName.message}
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
                      value={selectedType}
                      label="Tipo do Workspace"
                      onChange={(e) => setSelectedType(e.target.value)}
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
                      {typeList.map((entityType) => (
                        <MenuItem value={entityType.id} key={entityType.id}>
                          {entityType.name}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {errors.entityType?.message}
                    </FormHelperText>
                  </FormControl>

                  <InputTextMultiline
                    name={"entityDescription"}
                    label={"Descrição"}
                    type={"text"}
                    id={"entityDescription"}
                    inputProps={{
                      ...register("entityDescription"),
                    }}
                  />

                  <InputText
                    name={"entityPhone"}
                    label={"Telefone"}
                    type={"text"}
                    id={"entityPhone"}
                    inputProps={{
                      ...register("entityPhone"),
                    }}
                  />

                  <InputText
                    name={"entityEmail"}
                    label={"Email de Contato"}
                    type={"email"}
                    id={"entityEmail"}
                    error={errors.entityEmail}
                    helperText={
                      errors.entityEmail && errors.entityEmail.message
                    }
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
                    inputProps={{
                      ...register("entityWebsite"),
                    }}
                  />

                  <InputText
                    name={"entityCep"}
                    label={"CEP"}
                    type={"text"}
                    id={"entityCep"}
                    error={errors.entityCep}
                    helperText={errors.entityCep && errors.entityCep.message}
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
                      value={selectedCondition}
                      label="Condição do Workspace"
                      onChange={(e) => setSelectedCondition(e.target.value)}
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
                    <FormHelperText>
                      {errors.entityCondition?.message}
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
