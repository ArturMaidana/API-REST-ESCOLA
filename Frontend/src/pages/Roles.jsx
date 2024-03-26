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

// Importações de Componentes
import { mainListItems, secondaryListItems, tertiaryListItems } from "../components/ListItems";
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
import { Role } from "../components/Role";

// Importações de Serviços
import { getUserInformation, isSystemCoordinator } from "../utils/userUtils";
import { getRoles, createRole, updateRole, deleteRole } from "../services/roles";

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

export function Roles() {
  // Estados
  const [open, setOpen] = React.useState(false);
  const [result, setResult] = useState(null);
  const [userInformation, setUserInformation] = useState(null);
  const [roles, setRoles] = useState([]);
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
    findRoles();
    // eslint-disable-next-line
  }, [currentPage, pageSize]);

  // Hooks de formulário para validação
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  // Funções assíncronas
  async function findRoles() {
    try {
      setIsSearching(true);
      const result = await getRoles(currentPage, pageSize);
      setRoles(result.roles);
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

  async function addRole(data) {
    try {
      setIsCreating(true);
      await createRole(data);
      setIsCreated(false);
      setResult({
        title: "Wohoo, Sucesso!",
        message: "Cargo criado com sucesso.",
      });
      await findRoles();
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

  async function editRole(data) {
    try {
      await updateRole(data);
      setResult({
        title: "Wohoo, Feito!",
        message: "Cargo atualizado com sucesso.",
      });
      await findRoles();
    } catch (error) {
      setResult({
        title: "Uh, oh!",
        message:
          error.response?.data?.error ||
          "Por favor, informe-nos sobre este erro para que possamos resolvê-lo. Se precisar de assistência imediata, entre em contato conosco. Pedimos desculpas pelo inconveniente e agradecemos pela sua colaboração!",
      });
    }
  }

  async function removeRole(data) {
    try {
      await deleteRole(data);
      setResult({
        title: "Wohoo, Concluído!",
        message: "Cargo deletado com sucesso.",
      });
      await findRoles();
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
            <PageTitle props={"Cargos"} />
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
                {roles.length > 0 ? (
                  roles.map((role, index) => <Role key={index} role={role} editRole={editRole} removeRole={removeRole} />)
                ) : (
                  <p className="text-center">No momento ainda não existe nenhum dado para a categoria selecionada.</p>
                )}

                {/* Paginação */}
                <PaginationStyled count={totalPages} page={currentPage} onChange={(event, page) => setCurrentPage(page)} />
              </Box>
            )}

            {/* Modal de criação. O ideal seria componentizar, pois é parecido com o modal de editar */}
            <Dialog open={isCreated} onClose={() => setIsCreated(false)} fullWidth>
              <form onSubmit={handleSubmit(addRole)}>
                <DialogTitle>
                  {" "}
                  <HeaderText props={"Novo Registro de Dados"} />
                </DialogTitle>

                <DialogContent>
                  <InputText
                    name={"roleName"}
                    label={"Nome"}
                    type={"text"}
                    id={"roleName"}
                    error={errors.roleName}
                    helperText={errors.roleName && errors.roleName.message}
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
                    label={"Descrição"}
                    type={"text"}
                    id={"roleDescription"}
                    inputProps={{
                      ...register("roleDescription"),
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
    </ThemeProvider>
  );
}
