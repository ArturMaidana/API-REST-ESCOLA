// Importações de Bibliotecas e Frameworks
import * as React from "react";
import { Link } from "react-router-dom";
import { ListItemButton, ListItemIcon, ListItemText, ListSubheader, Tooltip } from "@mui/material";
import { Home, Dashboard, People, Business, Article, Bookmark } from "@mui/icons-material";

function ListSubheaderStyled({ text }) {
  return (
    <ListSubheader component="div" inset sx={{ color: "var(--dark-three)" }}>
      {text}
    </ListSubheader>
  );
}

function ListItemTextStyled({ primary }) {
  return <ListItemText primary={primary} sx={{ color: "var(--dark-three)" }} />;
}

function ListItemIconStyled({ tooltipTitle, icon }) {
  return (
    <ListItemIcon>
      <Tooltip title={tooltipTitle}>
        {React.cloneElement(icon, {
          sx: { color: "var(--dark-three)" },
        })}
      </Tooltip>
    </ListItemIcon>
  );
}

export const mainListItems = (
  <React.Fragment>
    <Link to="/home" style={{ textDecoration: "none", color: "inherit" }}>
      <ListItemButton>
        <ListItemIconStyled icon={<Home />} tooltipTitle="Página Inicial" />
        <ListItemTextStyled primary={"Página Inicial"} />
      </ListItemButton>
    </Link>
    <Link to="/Dashboard" style={{ textDecoration: "none", color: "inherit" }}>
      <ListItemButton>
        <ListItemIconStyled icon={<Dashboard />} tooltipTitle="Dashboard" />
        <ListItemTextStyled primary={"Dashboard"} />
      </ListItemButton>
    </Link>
  </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment>
    <ListSubheaderStyled text="Informações" />
    <Link to="/users" style={{ textDecoration: "none", color: "inherit" }}>
      <ListItemButton>
        <ListItemIconStyled icon={<People />} tooltipTitle="Usuários" />
        <ListItemTextStyled primary={"Usuários"} />
      </ListItemButton>
    </Link>
    <Link to="/turmas" style={{ textDecoration: "none", color: "inherit" }}>
      <ListItemButton>
        <ListItemIconStyled icon={<Business />} tooltipTitle="Turmas" />
        <ListItemTextStyled primary={"Turmas"} />
      </ListItemButton>
    </Link>
    <Link to="/alunos" style={{ textDecoration: "none", color: "inherit" }}>
      <ListItemButton>
        <ListItemIconStyled icon={<Article />} tooltipTitle="Alunos" />
        <ListItemTextStyled primary={"Alunos"} />
      </ListItemButton>
    </Link>
  </React.Fragment>
);

export const tertiaryListItems = (
  <React.Fragment>
    <ListSubheaderStyled text="Relatórios" />

    <Link to="/report-aluno" style={{ textDecoration: "none", color: "inherit" }}>
      <ListItemButton>
        <ListItemIconStyled icon={<Bookmark />} tooltipTitle="Relatorio Aluno" />
        <ListItemTextStyled primary={"Relatório Aluno"} />
      </ListItemButton>
    </Link>

    <Link to="/report-professor" style={{ textDecoration: "none", color: "inherit" }}>
      <ListItemButton>
        <ListItemIconStyled icon={<Bookmark />} tooltipTitle="Relatorio Professores" />
        <ListItemTextStyled primary={"Relatório Professores"} />
      </ListItemButton>
    </Link>
  </React.Fragment>
);
