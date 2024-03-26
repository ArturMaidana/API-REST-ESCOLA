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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MoonIcon from "../components/MoonIcon";

// Importações de Componentes
import { mainListItems, secondaryListItems, tertiaryListItems } from "../components/ListItems";
import { PageTitle } from "../components/PageTitle";
import { AccountMenu } from "../components/AccountMenu";
import { AlertDialog } from "../components/AlertDialog";
import { ButtonCreateItem } from "../components/ButtonCreateItem";
import { HeaderText } from "../components/HeaderText";
import { InputText } from "../components/InputText";
import { ButtonCancel } from "../components/ButtonCancel";
import { ButtonConfirm } from "../components/ButtonConfirm";
import { CircularProgressButtonStyled } from "../components/CircularProgressButtonStyled";
import { CircularProgressListStyled } from "../components/CircularProgressListStyled";
import { PaginationStyled } from "../components/PaginationStyled";
import { Copyright } from "../components/Copyright";
import { Turma } from "../components/Turma";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Importações de Serviços
import { getUserInformation, isSystemCoordinator } from "../utils/userUtils";
import { getTurmas, createTurma, updateTurma, deleteTurma } from "../services/turmas";

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
  backgroundColor: theme.palette.mode === "dark" ? theme.palette.primary.main : theme.palette.secondary.main,
  // Pode ajustar outras propriedades de estilo conforme necessário
  "& .MuiToolbar-root": {
    background: theme.palette.mode === "dark" ? theme.palette.primary.main : theme.palette.secondary.main,
  },
  "& .MuiIconButton-root": {
    color: theme.palette.mode === "dark" ? theme.palette.secondary.contrastText : theme.palette.primary.contrastText,
  },
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

export function Turmas() {
  // Estados
  const [open, setOpen] = React.useState(false);
  const [result, setResult] = useState(null);
  const [userInformation, setUserInformation] = useState(null);
  const [turmas, setturmas] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [darkMode, setDarkMode] = useState(() => {
    // Inicializa o modo escuro com base no valor armazenado em localStorage, se disponível
    const storedDarkMode = localStorage.getItem("darkMode");
    return storedDarkMode ? JSON.parse(storedDarkMode) : false;
  });
  // eslint-disable-next-line
  const [pageSize, setPageSize] = useState(10);

  //
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    // Salva o estado do modo escuro em localStorage
    localStorage.setItem("darkMode", JSON.stringify(newDarkMode));
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: "#a911db",
      },
      secondary: {
        main: "#11db91",
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              color: darkMode ? "#fff" : "#000",
            },
          },
        },
      },
    },
  });

  const showSuccessToast = (message) => {
    toast.success(message, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
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
    findturmas();
    // eslint-disable-next-line
  }, [currentPage, pageSize]);

  // Hooks de formulário para validação
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  // Funções assíncronas
  async function findturmas() {
    try {
      setIsSearching(true);
      const result = await getTurmas(currentPage, pageSize);
      setturmas(result.turmas);
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

  async function addturma(data) {
    try {
      setIsCreating(true);
      await createTurma(data);
      setIsCreated(false);
      showSuccessToast("Turma Criado com sucesso.");

      await findturmas();
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

  async function editTurma(data) {
    try {
      await updateTurma(data);
      showSuccessToast("Turma Editado com sucesso.");

      await findturmas();
    } catch (error) {
      setResult({
        title: "Uh, oh!",
        message:
          error.response?.data?.error ||
          "Por favor, informe-nos sobre este erro para que possamos resolvê-lo. Se precisar de assistência imediata, entre em contato conosco. Pedimos desculpas pelo inconveniente e agradecemos pela sua colaboração!",
      });
    }
  }

  async function removeTurma(data) {
    try {
      await deleteTurma(data);
      showSuccessToast("Turma Removido com sucesso.");

      await findturmas();
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
    <ThemeProvider theme={theme}>
      <AlertDialog show={result} title={result?.title} message={result?.message} handleClose={() => setResult(null)} />

      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open} sx={{ background: "var(--main-one)" }}>
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
            <PageTitle props={"Turmas"} />
            <MoonIcon onClick={toggleDarkMode} darkMode={darkMode} />
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
            backgroundColor: (theme) => (theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[900]),
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/*  */}
            {userInformation && isSystemCoordinator(userInformation) && <ButtonCreateItem onClick={() => setIsCreated(true)} />}

            {/* TODO Filtro */}

            {/*  */}
            {isSearching ? (
              <CircularProgressListStyled />
            ) : (
              <Box>
                {turmas.length > 0 ? (
                  turmas.map((turma, index) => <Turma key={index} turma={turma} editTurma={editTurma} removeTurma={removeTurma} />)
                ) : (
                  <p className="text-center">No momento ainda não existe nenhum dado para a categoria selecionada.</p>
                )}

                {/* Paginação */}
                <PaginationStyled count={totalPages} page={currentPage} onChange={(event, page) => setCurrentPage(page)} />
              </Box>
            )}

            {/* Modal de criação. O ideal seria componentizar, pois é parecido com o modal de editar */}
            <Dialog open={isCreated} onClose={() => setIsCreated(false)} fullWidth>
              <form onSubmit={handleSubmit(addturma)}>
                <DialogTitle>
                  {" "}
                  <HeaderText props={"Matricular Aluno"} />
                </DialogTitle>

                <DialogContent>
                  <InputText
                    name={"turmaName"}
                    label={"Nome da Turma"}
                    type={"text"}
                    id={"turmaName"}
                    error={errors.turmaName}
                    helperText={errors.turmaName && errors.turmaName.message}
                    inputProps={{
                      ...register("turmaName", {
                        required: {
                          value: true,
                          message: "Informe um nome para registrar a turma.",
                        },
                      }),
                    }}
                  />

                  <InputText
                    name={"turmaEnsino"}
                    label={"Tipo de Ensino"}
                    type={"text"}
                    id={"turmaEnsino"}
                    error={errors.turmaEnsino}
                    helperText={errors.turmaEnsino && errors.turmaEnsino.message}
                    inputProps={{
                      ...register("turmaEnsino", {
                        required: {
                          value: true,
                          message: "Informe o tipo de ensino.",
                        },
                      }),
                    }}
                  />

                  <InputText
                    name={"turmaTurno"}
                    label={"Turno"}
                    type={"text"}
                    id={"turmaTurno"}
                    error={errors.turmaTurno}
                    helperText={errors.turmaTurno && errors.turmaTurno.message}
                    inputProps={{
                      ...register("turmaTurno", {
                        required: {
                          value: true,
                          message: "Informe o turno.",
                        },
                      }),
                    }}
                  />

                  <InputText
                    name={"turmaCoordenador"}
                    label={"Coordenador Responsável"}
                    type={"text"}
                    id={"turmaCoordenador"}
                    error={errors.turmaCoordenador}
                    helperText={errors.turmaCoordenador && errors.turmaCoordenador.message}
                    inputProps={{
                      ...register("turmaCoordenador", {
                        required: {
                          value: true,
                          message: "Informe um nome do responsável pela turma.",
                        },
                      }),
                    }}
                  />

                  <InputText
                    name={"turmaEscola"}
                    label={"Nome da Escola"}
                    type={"text"}
                    id={"turmaEscola"}
                    error={errors.turmaEscola}
                    helperText={errors.turmaEscola && errors.turmaEscola.message}
                    inputProps={{
                      ...register("turmaEscola", {
                        required: {
                          value: true,
                          message: "Informe o nome da escola.",
                        },
                      }),
                    }}
                  />
                </DialogContent>

                <DialogActions sx={{ mb: 3, mr: 2 }}>
                  <ButtonCancel onClick={() => setIsCreated(false)} />
                  {isCreating ? <ButtonConfirm props={<CircularProgressButtonStyled />} /> : <ButtonConfirm type={"submit"} props={"Adicionar à Lista"} />}
                </DialogActions>
              </form>
            </Dialog>

            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
      <ToastContainer />
    </ThemeProvider>
  );
}
