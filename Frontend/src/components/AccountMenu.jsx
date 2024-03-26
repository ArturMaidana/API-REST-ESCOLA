// Importações de Bibliotecas e Frameworks
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Box, Menu, MenuItem, ListItemIcon, Divider, IconButton, Tooltip, ListItemText } from "@mui/material";
import { Logout, Person } from "@mui/icons-material";
import { getProfile } from "../services/users";

export function AccountMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [username, setUserName] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getProfile();

        if (response && response.loggedUser) {
          // Certifique-se de que response.loggedUser contém o nome do usuário
          setUserName(response.loggedUser.name);
        } else {
          console.error("Perfil não encontrado");
        }
      } catch (error) {
        console.error("Erro ao buscar perfil:", error);
      }
    };

    fetchUserProfile(); // Chame a função imediatamente
  }, []);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <React.Fragment>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Tooltip title="Configurações da Conta">
          <IconButton onClick={handleClick} size="small" aria-controls={open ? "account-menu" : undefined} aria-haspopup="true" aria-expanded={open ? "true" : undefined}>
            <Person
              sx={{
                color: "var(--light-one)",
                marginRight: "4px",
              }}
            />
            <span style={{ color: "white" }}>{username}</span>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        style={{ marginTop: "25px" }}
      >
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Person fontSize="small" sx={{ color: "var(--dark-three)" }} />
          </ListItemIcon>
          <Link to="/profile" style={{ textDecoration: "none", color: "inherit" }}>
            <ListItemText primary={"Perfil "} sx={{ color: "var(--dark-three)" }} />
          </Link>
        </MenuItem>
        <Divider />
        <Link
          onClick={() => {
            sessionStorage.removeItem("token");
          }}
          to="/login"
          style={{
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <Logout fontSize="small" sx={{ color: "var(--dark-three)" }} />
            </ListItemIcon>
            <ListItemText primary={"Sair"} sx={{ color: "var(--dark-three)" }} />
          </MenuItem>
        </Link>
      </Menu>
    </React.Fragment>
  );
}
