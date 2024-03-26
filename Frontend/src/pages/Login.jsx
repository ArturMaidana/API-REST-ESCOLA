// Importações de Bibliotecas e Frameworks
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { CssBaseline, Box, Typography, Grid, createTheme, ThemeProvider, Button, Paper } from "@mui/material";

// Importações de Estilos
//import { LogoComponent } from "../assets/index";
import { Link } from "react-router-dom";
import loginBg from "../assets/images/mapacuiaba.webp"; 
import LOGO from "../assets/images/mapacuiaba.webp"

// Importações de Componentes
import { AlertDialog } from "../components/AlertDialog";
import { InputText } from "../components/InputText";
import { CircularProgressButtonStyled } from "../components/CircularProgressButtonStyled";
import { Copyright } from "../components/Copyright";

// Importações de Serviços
import { login } from "../services/users";

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export function Login() {
  // Estados
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Hooks de formulário para validação
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  // Funções assíncronas
  const onLogin = async (data) => {
    try {
      setIsLoading(true);
      const user = await login(data);
      setResult(user);
      navigate("/home");
    } catch (error) {
      setResult({
        title: "Uh, oh!",
        message:
          error.response?.data?.error ||
          "Por favor, informe-nos sobre este erro para que possamos resolvê-lo. Se precisar de assistência imediata, entre em contato conosco. Pedimos desculpas pelo inconveniente e agradecemos pela sua colaboração!",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <AlertDialog show={result} title={result?.title} message={result?.message} handleClose={() => setResult(null)} />

      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${loginBg})`,
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) => (t.palette.mode === "light" ? t.palette.grey[50] : t.palette.grey[900]),
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h6" textAlign={"center"} color={"var(--dark-two)"}>
              União Mato-Grossense de Estudantes.
            </Typography>
            <Typography variant="subtitle1" color="var(--dark-three)">
              Faça parte dessa união!
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit(onLogin)} sx={{ mt: 1 }}>
              <InputText
                name={"userEmail"}
                label={"Endereço de email"}
                type={"email"}
                id={"userEmail"}
                autoComplete={"email"}
                autoFocus
                error={errors.userEmail}
                helperText={errors.userEmail && errors.userEmail.message}
                inputProps={{
                  ...register("userEmail", {
                    required: {
                      value: true,
                      message: "Parece que você esqueceu de preencher o campo de e-mail.",
                    },
                  }),
                }}
              />
              <InputText
                name={"userPassword"}
                label={"Senha"}
                type={"password"}
                id={"userPassword"}
                autoComplete="current-password"
                error={errors.userPassword}
                helperText={errors.userPassword && errors.userPassword.message}
                inputProps={{
                  ...register("userPassword", {
                    required: {
                      value: true,
                      message: "Parece que você esqueceu de preencher o campo de senha.",
                    },
                  }),
                }}
              />
              <Typography variant="body2" color="var(--dark-three)">
                Por razões de segurança, a opção "Manter-se conectado" não está disponível.
              </Typography>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  backgroundColor: "var(--main-one)",
                  color: "var(--light-one)",
                  boxShadow: "none",
                  "&:hover": {
                    backgroundColor: "var(--main-two)",
                    boxShadow: "none",
                  },
                }}
              >
                {isLoading ? <CircularProgressButtonStyled /> : "Login"}
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link to="/not-found" variant="body2" style={{ textDecoration: "none", color: "inherit" }}>
                    {" Esqueceu a senha?"}
                  </Link>
                </Grid>
                <Grid item>
                  <Link to="/register" variant="body2" style={{ textDecoration: "none", color: "inherit" }}>
                    {"Não tem uma conta? Cadastre-se"}
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ pt: 4 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
