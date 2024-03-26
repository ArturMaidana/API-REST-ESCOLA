// Importações de Serviços
import { api } from "./api";
import { getAccessToken } from "../utils/auth";

export async function getEntityById(id) {
  try {
    const result = await api.get(`/entity/${id}`);
    return {
      entity: result.data.entity,
    };
  } catch (error) {
    console.error("Erro de serviço:", error);
    throw error;
  }
}

export async function getAllEntities() {
  try {
    const result = await api.get("/entities/all");
    return {
      entities: result.data.entities,
    };
  } catch (error) {
    console.error("Erro de serviço:", error);
    throw error;
  }
}

export async function getEntities(currentPage, pageSize) {
  try {
    const result = await api.get("/entities", {
      params: {
        currentPage,
        pageSize,
      },
    });
    // Retorna diretamente os dados relevantes da resposta
    return {
      entities: result.data.entities,
      totalPages: result.data.totalPages,
      currentPage: result.data.currentPage,
    };
  } catch (error) {
    console.error("Erro de serviço:", error);
    throw error;
  }
}

export async function createEntity(data) {
  try {
    const result = await api.post(
      "/entity",
      {
        name: data.entityName,
        entityTypeId: data.entityType,
        description: data.entityDescription,
        phone: data.entityPhone,
        email: data.entityEmail,
        website: data.entityWebsite,
        cep: data.entityCep,
        conditionId: data.entityCondition,
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

export async function updateEntity(data) {
  try {
    const result = await api.put(
      `/entity/${data.id}`,
      {
        name: data.entityName,
        entityTypeId: data.entityType,
        description: data.entityDescription,
        phone: data.entityPhone,
        email: data.entityEmail,
        website: data.entityWebsite,
        cep: data.entityCep,
        conditionId: data.entityCondition,
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

export async function deleteEntity(data) {
  try {
    const result = await api.delete(`/entity/${data.id}`, {
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
