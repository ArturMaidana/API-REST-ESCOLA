// Importações de Serviços
import { api } from "./api";
import { getAccessToken } from "../utils/auth";

export async function login(data) {
  try {
    const result = await api.post("/user/login", {
      email: data.userEmail,
      password: data.userPassword,
    });

    // Armazena o token de acesso retornado pela API na sessão do navegador
    sessionStorage.setItem("token", JSON.stringify(result.data.accessToken));
  } catch (error) {
    console.error("Erro de serviço:", error);
    throw error;
  }
}

export async function getUserById(id) {
  try {
    const result = await api.get(`/user/${id}`, {
      headers: {
        Authorization: getAccessToken(),
      },
    });
    return {
      user: result.data.user,
    };
  } catch (error) {
    console.error("Erro de serviço:", error);
    throw error;
  }
}

export async function getAllUsers() {
  try {
    const result = await api.get("/users/all", {
      headers: {
        Authorization: getAccessToken(),
      },
    });
    return {
      users: result.data.users,
    };
  } catch (error) {
    console.error("Erro de serviço:", error);
    throw error;
  }
}

export async function getUsers(currentPage, pageSize) {
  try {
    const result = await api.get("/users", {
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
      users: result.data.users,
      totalPages: result.data.totalPages,
      currentPage: result.data.currentPage,
    };
  } catch (error) {
    console.error("Erro de serviço:", error);
    throw error;
  }
}

export async function createUser(data) {
  try {
    const result = await api.post(
      "/user",
      {
        name: data.userName,
        email: data.userEmail,
        password: data.userPassword,
        roleId: data.userRole,
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

export async function updateUser(data) {
  // Se um usuário alterar o próprio cargo ou o cargo de outro usuário, as modificações só terão efeito após o usuário redefinir seu token de acesso.
  try {
    const result = await api.put(
      `/user/${data.id}`,
      {
        name: data.userName,
        email: data.userEmail,
        password: data.userPassword,
        roleId: data.userRole,
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

export async function deleteUser(data) {
  try {
    const result = await api.delete(`/user/${data.id}`, {
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

// Adicionando a função para obter informações do usuário logado
export async function getProfile() {
  try {
    const result = await api.get("/profile", {
      headers: {
        Authorization: getAccessToken(),
      },
    });
    console.log("Resultado da API (getLoggedUserInfo):", result.data);
    return {
      loggedUser: result.data.loggedUser,
      
    };
  } catch (error) {
    console.error("Perfil não encontrado", error);
    throw error;
  }
}
