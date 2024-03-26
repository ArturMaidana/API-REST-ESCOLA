// Importações de Serviços
import { api } from "./api";
import { getAccessToken } from "../utils/auth";

export async function getAllEntityTypes() {
  try {
    const result = await api.get("/entitytypes/all");
    return {
      entityTypes: result.data.entityTypes,
    };
  } catch (error) {
    console.error("Erro de serviço:", error);
    throw error;
  }
}

export async function getEntityTypes(currentPage, pageSize) {
  try {
    const result = await api.get("/entitytypes", {
      params: {
        currentPage,
        pageSize,
      },
    });
    // Retorna diretamente os dados relevantes da resposta
    return {
      entityTypes: result.data.entityTypes,
      totalPages: result.data.totalPages,
      currentPage: result.data.currentPage,
    };
  } catch (error) {
    console.error("Erro de serviço:", error);
    throw error;
  }
}

export async function createEntityType(data) {
  try {
    const result = await api.post(
      "/entitytype",
      {
        name: data.entityTypeName,
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

export async function updateEntityType(data) {
  try {
    const result = await api.put(
      `/entitytype/${data.id}`,
      {
        name: data.entityTypeName,
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

export async function deleteEntityType(data) {
  try {
    const result = await api.delete(`/entitytype/${data.id}`, {
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
