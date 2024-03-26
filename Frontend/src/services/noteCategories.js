// Importações de Serviços
import { api } from "./api";
import { getAccessToken } from "../utils/auth";

export async function getAllNoteCategories() {
  try {
    const result = await api.get("/notecategories/all");
    return {
      noteCategories: result.data.noteCategories,
    };
  } catch (error) {
    console.error("Erro de serviço:", error);
    throw error;
  }
}

export async function getNoteCategories(currentPage, pageSize) {
  try {
    const result = await api.get("/notecategories", {
      params: {
        currentPage,
        pageSize,
      },
    });
    // Retorna diretamente os dados relevantes da resposta
    return {
      noteCategories: result.data.noteCategories,
      totalPages: result.data.totalPages,
      currentPage: result.data.currentPage,
    };
  } catch (error) {
    console.error("Erro de serviço:", error);
    throw error;
  }
}

export async function createNoteCategory(data) {
  try {
    const result = await api.post(
      "/notecategory",
      {
        name: data.noteCategoryName,
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

export async function updateNoteCategory(data) {
  try {
    const result = await api.put(
      `/notecategory/${data.id}`,
      {
        name: data.noteCategoryName,
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

export async function deleteNoteCategory(data) {
  try {
    const result = await api.delete(`/notecategory/${data.id}`, {
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
