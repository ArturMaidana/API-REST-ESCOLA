// Importações de Serviços
import { api } from "./api";
import { getAccessToken } from "../utils/auth";

export async function getAllAlunos() {
  try {
    const result = await api.get("/alunos/all", {
      headers: {
        Authorization: getAccessToken(),
      },

    });
    return {
      alunos: result.data.alunos,

    };

    
  } catch (error) {
    console.error("Erro de serviço:", error);
    throw error;
  }
}

export async function BuscarAlunos(filters) {
  // Obtém o token de acesso da sessão do navegador
  const accessToken = sessionStorage.getItem("token");

  // Faz uma solicitação GET para a rota '/alunos' da API, passando o token de autorização e os filtros como parâmetros
  const result = await api.get("/alunos", {
    headers: {
      Authorization: `Bearer ${JSON.parse(accessToken)}`,
    },
    params: filters,
  });

  // Retorna o resultado da solicitação
  return result;
}

export async function getAlunos(currentPage, pageSize) {
  try {
    const result = await api.get("/alunos", {
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
      alunos: result.data.alunos,
      totalPages: result.data.totalPages,
      currentPage: result.data.currentPage,
    };
  } catch (error) {
    console.error("Erro de serviço:", error);
    throw error;
  }
}

export async function createAlunos(data) {
  try {
    const result = await api.post(
      "/aluno",
      {
        name: data.alunosName,
        genero: data.alunosGenero,
        responsavel: data.alunosResponsavel,
        telefone: data.alunosTelefone,
        turma: data.alunosTurma,
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

export async function updateAlunos(data) {
  try {
    const result = await api.put(
      `/aluno/${data.id}`,
      {
        name: data.alunosName,
        genero: data.alunosGenero,
        responsavel: data.alunosResponsavel,
        telefone: data.alunosTelefone,
        turma: data.alunosTurma,
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

export async function deleteAlunos(data) {
  try {
    const result = await api.delete(`/aluno/${data.id}`, {
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
