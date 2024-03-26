// Importações de Bibliotecas e Frameworks
import React, { useState, useEffect } from "react";
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
  DialogTitle,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

// Importações de Componentes
import { mainListItems, secondaryListItems, tertiaryListItems } from "../components/ListItems";
import { PageTitle } from "../components/PageTitle";
import { AccountMenu } from "../components/AccountMenu";
import { AlertDialog } from "../components/AlertDialog";
import { ButtonCreateItem } from "../components/ButtonCreateItem";
import { HeaderText } from "../components/HeaderText";
import { Copyright } from "../components/Copyright";
import MoonIcon from "../components/MoonIcon";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Importações de Serviços
import {  isSystemCoordinator } from "../utils/userUtils";
import { getProfile } from "../services/users"; // Certifique-se de ter este serviço implementado
import  FotoUser from "../assets/images/user (2).png"

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

export function ProfilePage2() {
  // Estados
  const [open, setOpen] = React.useState(false);
  const [result, setResult] = useState(null);
  const [userInformation,] = useState(null);
  const [setIsCreated] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    // Inicializa o modo escuro com base no valor armazenado em localStorage, se disponível
    const storedDarkMode = localStorage.getItem("darkMode");
    return storedDarkMode ? JSON.parse(storedDarkMode) : false;
  });
  // eslint-disable-next-line

  //
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");


  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getProfile();

        if (response && response.loggedUser) {
          // Certifique-se de que response.loggedUser contém o nome do usuário
          setUserName(response.loggedUser.name);
          setEmail(response.loggedUser.email);
          setPassword(response.loggedUser.password);
          setRole(response.loggedUser.role.name);

        } 

        else {
          console.error("Perfil não encontrado");
        }
      } catch (error) {
        console.error("Erro ao buscar perfil:", error);
      }
    };

    fetchUserProfile(); // Chame a função imediatamente
  }, []);

  

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
            {/*  */}
            {userInformation && isSystemCoordinator(userInformation) && <ButtonCreateItem onClick={() => setIsCreated(true)} />}

            {/* TODO Filtro */}
            <DialogTitle>
              <HeaderText props={"Dados do Usuário"} />
            </DialogTitle>
            
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img src={FotoUser} alt="User" style={{ marginRight: '1rem', width: '100px', height: '100px', borderRadius: '50%' }} />
              <form className="container-margin">
                <div>
                  <label htmlFor="username">Nome:</label>
                  <input type="text" id="username" value={username} disabled />
                </div>
                <div>
                  <label htmlFor="email">Email:</label>
                  <input type="email" id="email" value={email} disabled />
                </div>
                <div>
                  <label htmlFor="password">Senha:</label>
                  <input type="password" id="password" value={password} disabled />
                </div>
                <div>
                  <label htmlFor="role">Cargo:</label>
                  <input type="text" id="role" value={role} disabled />
                </div>
              </form>
            </div>
            <div>
              <button>Editar</button>
              <button>Voltar</button>
            </div>
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
      <ToastContainer />
    </ThemeProvider>
  );
}
