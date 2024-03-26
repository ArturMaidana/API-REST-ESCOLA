// Importações de Serviços
import { api } from "./api";
import { getAccessToken } from "../utils/auth";

export async function getAllConditions() {
  try {
    const result = await api.get("/conditions/all", {
      headers: {
        Authorization: getAccessToken(),
      },
    });
    return {
      conditions: result.data.conditions,
    };
  } catch (error) {
    console.error("Erro de serviço:", error);
    throw error;
  }
}

export async function getConditions(currentPage, pageSize) {
  try {
    const result = await api.get("/conditions", {
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
      conditions: result.data.conditions,
      totalPages: result.data.totalPages,
      currentPage: result.data.currentPage,
    };
  } catch (error) {
    console.error("Erro de serviço:", error);
    throw error;
  }
}

export async function createCondition(data) {
  try {
    const result = await api.post(
      "/condition",
      {
        name: data.conditionName,
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

export async function updateCondition(data) {
  try {
    const result = await api.put(
      `/condition/${data.id}`,
      {
        name: data.conditionName,
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

export async function deleteCondition(data) {
  try {
    const result = await api.delete(`/condition/${data.id}`, {
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
