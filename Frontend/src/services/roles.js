// Importações de Serviços
import { api } from "./api";
import { getAccessToken } from "../utils/auth";

export async function getAllRoles() {
  try {
    const result = await api.get("/roles/all", {
      headers: {
        Authorization: getAccessToken(),
      },
    });
    return {
      roles: result.data.roles,
    };
  } catch (error) {
    console.error("Erro de serviço:", error);
    throw error;
  }
}

export async function getRoles(currentPage, pageSize) {
  try {
    const result = await api.get("/roles", {
      params: {
        currentPage,
        pageSize,
      },
      headers: {
        Authorization: getAccessToken(),
      },
    });
    // Retorna diretamente os dados relevantes da resposta
    return {
      roles: result.data.roles,
      totalPages: result.data.totalPages,
      currentPage: result.data.currentPage,
    };
  } catch (error) {
    console.error("Erro de serviço:", error);
    throw error;
  }
}

export async function createRole(data) {
  try {
    const result = await api.post(
      "/role",
      {
        name: data.roleName,
        description: data.roleDescription,
      },
      {
        headers: {
          Authorization: getAccessToken(),
        },
      }
    );
    return result;
  } catch (error) {
    console.error("Erro de serviço:", error);
    throw error;
  }
}

export async function updateRole(data) {
  try {
    const result = await api.put(
      `/role/${data.id}`,
      {
        name: data.roleName,
        description: data.roleDescription,
      },
      {
        headers: {
          Authorization: getAccessToken(),
        },
      }
    );
    return result;
  } catch (error) {
    console.error("Erro de serviço:", error);
    throw error;
  }
}

export async function deleteRole(data) {
  try {
    const result = await api.delete(`/role/${data.id}`, {
      headers: {
        Authorization: getAccessToken(),
      },
    });
    return result;
  } catch (error) {
    console.error("Erro de serviço:", error);
    throw error;
  }
}


