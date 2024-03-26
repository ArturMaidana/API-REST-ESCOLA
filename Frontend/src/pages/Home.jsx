// Importações de Bibliotecas e Frameworks
import React, { useState, useEffect } from "react";
import { CssBaseline, Drawer as MuiDrawer, Box, AppBar as MuiAppBar, Toolbar, List, Divider, IconButton, Badge, Container, Grid, styled, createTheme, ThemeProvider } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

// Importações de Componentes
import { mainListItems, secondaryListItems, tertiaryListItems } from "../components/ListItems";
import { PageTitle } from "../components/PageTitle";
import { AccountMenu } from "../components/AccountMenu";
import { AlertDialog } from "../components/AlertDialog";
import { Copyright } from "../components/Copyright";
import MoonIcon from "../components/MoonIcon";

// Importações de Serviços
import { getUserInformation } from "../utils/userUtils";

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

export function Home() {
  // Estados
  const [open, setOpen] = React.useState(false);
  const [result, setResult] = useState(null);
  // eslint-disable-next-line
  const [userInformation, setUserInformation] = useState(null);
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

  //
  useEffect(() => {
    async function fetchUserInformation() {
      const result = await getUserInformation();
      setUserInformation(result);
    }
    fetchUserInformation();
  }, []);

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
            <PageTitle props={"Página Inicial"} />
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
            <Grid container spacing={3}></Grid>
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
      
    </ThemeProvider>
   
  );
}
