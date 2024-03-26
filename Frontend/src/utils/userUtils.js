// Importações de Serviços
import { getUserById } from "../services/users";
import { getAccessToken } from "./auth";

// Função para verificar se o usuário é um Coordenador de Sistema
export function isSystemCoordinator(user) {
  return user?.roleId === 1;
}

// Função para verificar se o usuário é um Gestor de Parceiros
export function isPartnershipManager(user) {
  return user?.roleId === 2;
}

// Função para verificar se o usuário é um Curador de Conteúdo
export function isContentCurator(user) {
  return user?.roleId === 3;
}

// Função principal para obter informações do usuário
export async function getUserInformation() {
  // Obtém o token de acesso
  const accessToken = getAccessToken();
  if (!accessToken) {
    console.error("Token de acesso não encontrado.");
    return null;
  }

  try {
    // Extrair o ID do usuário do token JWT
    const userId = parseJwt(accessToken)?.id;
    // Obter informações do usuário pelo ID
    const result = await getUserById(userId);
    // Retornar o usuário encontrado (ou null se não encontrado)
    return result?.user || null;
  } catch (error) {
    console.error("Erro ao obter informações do usuário:", error);
    return null;
  }
}

// Função para analisar um token JWT e extrair informações
function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (error) {
    console.error("Erro ao analisar token JWT:", error);
    return null;
  }
}
