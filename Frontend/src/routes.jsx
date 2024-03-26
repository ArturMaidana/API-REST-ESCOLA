// Importações de Bibliotecas e Frameworks
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

// Importações de Serviços
import { isAuthenticated } from "./utils/auth";

// Importações de Componentes
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import { Users } from "./pages/Users";
import { Turmas } from "./pages/Turmas";
import { Entities } from "./pages/Entities";
import { Notes } from "./pages/Notes";
import { Roles } from "./pages/Roles";
import { Alunos } from "./pages/Alunos";
import { Conditions } from "./pages/Conditions";
import { EntityTypes } from "./pages/EntityTypes";
import { NoteCategories } from "./pages/NoteCategories";
import { ProfilePage2 } from "./pages/Profilepage2";
import { Dashboard } from "./pages/Dashboard";
import { Graficos } from "./components/Barchart";

export function PrivateRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export function Navigations() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />


        <Route
          index
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        <Route
          path="/users"
          element={
            <PrivateRoute>
              <Users />
            </PrivateRoute>
          }
        />

        <Route
          path="/entities"
          element={
            <PrivateRoute>
              <Entities />
            </PrivateRoute>
          }
        />

        <Route
          path="/notes"
          element={
            <PrivateRoute>
              <Notes />
            </PrivateRoute>
          }
        />

        <Route
          path="/Dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/turmas"
          element={
            <PrivateRoute>
              <Turmas />
            </PrivateRoute>
          }
        />

        <Route
          path="/alunos"
          element={
            <PrivateRoute>
              <Alunos />
            </PrivateRoute>
          }
        />

        <Route
          path="/conditions"
          element={
            <PrivateRoute>
              <Conditions />
            </PrivateRoute>
          }
        />

        <Route
          path="/roles"
          element={
            <PrivateRoute>
              <Roles />
            </PrivateRoute>
          }
        />

        <Route
          path="/entitytypes"
          element={
            <PrivateRoute>
              <EntityTypes />
            </PrivateRoute>
          }
        />

        <Route
          path="/notecategories"
          element={
            <PrivateRoute>
              <NoteCategories />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage2 />
            </PrivateRoute>
          }
        />

        <Route
          path="*"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
