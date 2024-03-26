// Importações de Serviços
import { api } from "./api";
import { getAccessToken } from "../utils/auth";

export async function getNoteById(id) {
  try {
    const result = await api.get(`/note/${id}`);
    return {
      note: result.data.note,
    };
  } catch (error) {
    console.error("Erro de serviço:", error);
    throw error;
  }
}

export async function getAllNotes() {
  try {
    const result = await api.get("/notes/all");
    return {
      notes: result.data.notes,
    };
  } catch (error) {
    console.error("Erro de serviço:", error);
    throw error;
  }
}

export async function getNotes(currentPage, pageSize) {
  try {
    const result = await api.get("/notes", {
      params: {
        currentPage,
        pageSize,
      },
    });
    // Retorna diretamente os dados relevantes da resposta
    return {
      notes: result.data.notes,
      totalPages: result.data.totalPages,
      currentPage: result.data.currentPage,
    };
  } catch (error) {
    console.error("Erro de serviço:", error);
    throw error;
  }
}

export async function createNote(data) {
  try {
    const result = await api.post(
      "/note",
      {
        title: data.noteTitle,
        entityId: data.noteEntity,
        categoryId: data.noteCategory,
        body: data.noteBody,
        source: data.noteSource,
        conditionId: data.noteCondition,
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

export async function updateNote(data) {
  try {
    const result = await api.put(
      `/note/${data.id}`,
      {
        title: data.noteTitle,
        entityId: data.noteEntity,
        categoryId: data.noteCategory,
        body: data.noteBody,
        source: data.noteSource,
        conditionId: data.noteCondition,
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

export async function deleteNote(data) {
  try {
    const result = await api.delete(`/note/${data.id}`, {
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
