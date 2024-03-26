// Importações de Serviços
import { api } from "./api";
import { getAccessToken } from "../utils/auth";

export async function getAllTurmas() {
  try {
    const result = await api.get("/turmas/all", {
      headers: {
        Authorization: getAccessToken(),
      },
    });
    return {
      turmas: result.data.turmas,
    };
  } catch (error) {
    console.error("Erro de serviço:", error);
    throw error;
  }
}

export async function getTurmas(currentPage, pageSize) {
  try {
    const result = await api.get("/turmas", {
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
      turmas: result.data.turmas,
      totalPages: result.data.totalPages,
      currentPage: result.data.currentPage,
    };
  } catch (error) {
    console.error("Erro de serviço:", error);
    throw error;
  }
}

export async function createTurma(data) {
  try {
    const result = await api.post(
      "/turma",
      {
        name: data.turmaName,
        ensino: data.turmaEnsino,
        turno: data.turmaTurno,
        coordenador: data.turmaCoordenador,
        escola: data.turmaEscola,
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

export async function updateTurma(data) {
  try {
    const result = await api.put(
      `/turma/${data.id}`,
      {
        name: data.turmaName,
        ensino: data.turmaEnsino,
        turno: data.turmaTurno,
        coordenador: data.turmaCoordenador,
        escola: data.turmaEscola,
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

export async function deleteTurma(data) {
  try {
    const result = await api.delete(`/turma/${data.id}`, {
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
