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
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MenuItem from "@mui/material/MenuItem";

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
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import { Copyright } from "../components/Copyright";
import { Aluno } from "../components/Aluno";
import MoonIcon from "../components/MoonIcon";
import { ToastContainer, toast } from "react-toastify";
import html2canvas from "html2canvas"; // Importe html2canvas
import "react-toastify/dist/ReactToastify.css";

// Importações de Serviços
import { getUserInformation, isSystemCoordinator } from "../utils/userUtils";
import { AlunosFilter } from "../components/AlunosFilter";
import { getAlunos, createAlunos, updateAlunos, deleteAlunos, getAllTurmas } from "../services/alunos";

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

export function Alunos() {
  // Estados
  const [open, setOpen] = React.useState(false);
  const [result, setResult] = useState(null);
  const [userInformation, setUserInformation] = useState(null);
  const [alunos, setAlunos] = useState([]);
  const [filtro, setFiltro] = useState([]);
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

  const captureFormAsImage = async () => {
    try {
      const formElement = document.getElementById(15); // Substitua 'seu-id-de-formulario' pelo ID do seu formulário
      const canvas = await html2canvas(formElement);
      const imageData = canvas.toDataURL("image/png");

      // Aqui você pode salvar a imagem, exibi-la em uma nova janela, enviar para o backend, etc.
      console.log(imageData);
    } catch (error) {
      console.error("Erro ao capturar o formulário como imagem:", error);
    }
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

  const [turmas, setTurmas] = useState([]);

  useEffect(() => {
    async function fetchTurmas() {
      try {
        const result = await getAllTurmas();
        setTurmas(result.turmas);
      } catch (error) {
        console.error("Erro ao obter turmas:", error);
      }
    }
    fetchTurmas();
  }, []);

  useEffect(() => {
    findAlunos();
    // eslint-disable-next-line
  }, [currentPage, pageSize]);

  // Hooks de formulário para validação
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  // Funções assíncronas
  async function findAlunos() {
    try {
      setIsSearching(true);
      const result = await getAlunos(currentPage, pageSize, filtro);
      setAlunos(result.alunos);
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

  async function addAlunos(data) {
    console.log(data);
    try {
      setIsCreating(true);
      await createAlunos({
        ...data,
        alunosTurma: data.alunosTurma,
      });
      setIsCreated(false);
      showSuccessToast("Aluno Matriculado com sucesso.");

      await findAlunos();
    } catch (error) {
      setResult({
        title: "Uh, oh!",
        message: error.response?.data?.error || "Por favor, informe-nos sobre este erro para que possamos resolvê-lo.",
      });
    } finally {
      setIsCreating(false);
    }
  }

  async function editAlunos(data) {
    try {
      console.log(data);

      await updateAlunos(data);
      showSuccessToast("Aluno Editado com sucesso.");

      await findAlunos();
    } catch (error) {
      setResult({
        title: "Uh, oh!",
        message:
          error.response?.data?.error ||
          "Por favor, informe-nos sobre este erro para que possamos resolvê-lo. Se precisar de assistência imediata, entre em contato conosco. Pedimos desculpas pelo inconveniente e agradecemos pela sua colaboração!",
      });
    }
  }

  async function removeAlunos(data) {
    try {
      await deleteAlunos(data);
      showSuccessToast("Aluno Removido com sucesso.");

      await findAlunos();
    } catch (error) {
      setResult({
        title: "Uh, oh!",
        message:
          error.response?.data?.error ||
          "Por favor, informe-nos sobre este erro para que possamos resolvê-lo. Se precisar de assistência imediata, entre em contato conosco. Pedimos desculpas pelo inconveniente e agradecemos pela sua colaboração!",
      });
    }
  }

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFiltro({ ...filtro, [name]: value });
  };
  
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
            <PageTitle props={"Alunos"} />
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
          <AlunosFilter onFilter={handleFilterChange} />
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="select-turma">Filtrar por Turma</InputLabel>
          <Select
            labelId="select-turma"
            id="select-turma"
            name="turno"
            value={filtro.turno}
            onChange={handleFilterChange}
          >
            <MenuItem value="">Todos</MenuItem>
            {turmas.map((turma) => (
              <MenuItem key={turma.id} value={turma.nome}>
                {turma.nome}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
            {/*  */}
            {userInformation && isSystemCoordinator(userInformation) && <ButtonCreateItem onClick={() => setIsCreated(true)} />}

            {/* TODO Filtro */}

            {/*  */}
            {isSearching ? (
              <CircularProgressListStyled />
            ) : (
              <Box>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>

                {alunos.length > 0 ? (
                  alunos.map((aluno, index) => <Aluno key={index} aluno={aluno} editAlunos={editAlunos} removeAlunos={removeAlunos} alunoID ={aluno.id}/>)
                ) : (
                  <p className="text-center">No momento ainda não existe nenhum dado para a categoria selecionada.</p>
                )}
                                  </div>


                {/* Paginação */}
                <Button onClick={captureFormAsImage}>Gerar Imagem do Formulário</Button>
                <PaginationStyled count={totalPages} page={currentPage} onChange={(event, page) => setCurrentPage(page)} />
              </Box>
            )}

            {/* Modal de criação. O ideal seria componentizar, pois é parecido com o modal de editar */}
            <Dialog open={isCreated} onClose={() => setIsCreated(false)} fullWidth>
              <form onSubmit={handleSubmit(addAlunos)}>
                <DialogTitle>
                  {" "}
                  <HeaderText props={"Cadastrar Alunos"} />
                </DialogTitle>

                <DialogContent>
                  <InputText
                    name={"alunosName"}
                    label={"Nome da Turma"}
                    type={"text"}
                    id={"alunosName"}
                    error={errors.alunosName}
                    helperText={errors.alunosName && errors.alunosName.message}
                    inputProps={{
                      ...register("alunosName", {
                        required: {
                          value: true,
                          message: "Informe o nome do aluno.",
                        },
                      }),
                    }}
                  />

                  <InputText
                    name={"alunosGenero"}
                    label={"Genero"}
                    type={"text"}
                    id={"alunosGenero"}
                    error={errors.alunosGenero}
                    helperText={errors.alunosGenero && errors.alunosGenero.message}
                    inputProps={{
                      ...register("alunosGenero", {
                        required: {
                          value: true,
                          message: "Informe o gênero do Aluno.",
                        },
                      }),
                    }}
                  />

                  <InputText
                    name={"alunosResponsavel"}
                    label={"Nome do Responsável"}
                    type={"text"}
                    id={"alunosResponsavel"}
                    error={errors.alunosResponsavel}
                    helperText={errors.alunosResponsavel && errors.alunosResponsavel.message}
                    inputProps={{
                      ...register("alunosResponsavel", {
                        required: {
                          value: true,
                          message: "Informe o nome do responsável.",
                        },
                      }),
                    }}
                  />

                  <InputText
                    name={"alunosTelefone"}
                    label={"Telefone"}
                    type={"text"}
                    id={"alunosTelefone"}
                    error={errors.alunosTelefone}
                    helperText={errors.alunosTelefone && errors.alunosTelefone.message}
                    inputProps={{
                      ...register("alunosTelefone", {
                        required: {
                          value: true,
                          message: "Informe o número de contato.",
                        },
                      }),
                    }}
                  />

                  <FormControl fullWidth>
                    <InputLabel id="alunosTurma">Turma</InputLabel>
                    <Select
                      labelId="alunosTurma"
                      id="alunosTurma"
                      type={"text"}
                      {...register("alunosTurma", {
                        required: {
                          value: true,
                          message: "Informe a turma do aluno.",
                        },
                      })}
                    >
                      {turmas.map((turma) => (
                        <MenuItem key={turma.name} value={turma.name}>
                          {turma.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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
