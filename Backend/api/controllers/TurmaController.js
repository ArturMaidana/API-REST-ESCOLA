// Importações de Serviços
const { HttpResponse } = require("../utils/httpResponse");
const database = require("../models");
const { isSystemCoordinator } = require("../utils/userUtils");

class TurmaController {
  async getAll(_, res) {
    const httpResponse = new HttpResponse(res);
    try {
      // Consulta o banco de dados para obter as informações ordenadas pelo nome
      const turmas = await database.turmas.findAll({
        order: [["name", "ASC"]],
      });

      return httpResponse.ok({ turmas });
    } catch (error) {
      return httpResponse.internalError(error);
    }
  }

  async get(req, res) {
    const httpResponse = new HttpResponse(res);
    try {
      // Extrai parâmetros da requisição ou define valores padrão
      let { currentPage, pageSize } = req.query;
      currentPage = parseInt(currentPage, 10);
      pageSize = parseInt(pageSize, 10);
      if (isNaN(currentPage) || currentPage <= 0) {
        currentPage = 1;
      }
      if (isNaN(pageSize) || pageSize <= 0) {
        pageSize = 10;
      }

      // Calcula o deslocamento com base na página e no tamanho da página
      const offset = (currentPage - 1) * pageSize;

      // Consulta o banco de dados para obter as informações paginadas e ordenadas por nome
      const { count, rows: turmas } = await database.turmas.findAndCountAll({
        order: [["name", "ASC"]],
        offset,
        limit: pageSize,
      });

      // Calcula a quantidade total de páginas com base na quantidade total de itens e no tamanho da página
      const totalPages = Math.ceil(count / pageSize);

      // Retorna a resposta, incluindo as informações do banco de dados, a quantidade total de páginas disponíveis e a página atual.
      return httpResponse.ok({
        turmas,
        totalPages,
        currentPage,
      });
    } catch (error) {
      return httpResponse.internalError(error);
    }
  }

  async create(req, res) {
    const httpResponse = new HttpResponse(res);
    try {
      const { name, ensino, turno, coordenador, escola } = req.body;

      // Verifica se o usuário logado tem permissão de administrador
      const isCoordinator = await isSystemCoordinator(req.userId.id);
      if (!isCoordinator) {
        return httpResponse.forbidden("Você não tem permissão para esta ação.");
      }

      //
      if (typeof name !== "string" || name.trim() === "") {
        return httpResponse.badRequest("Informe um nome para o cargo!");
      }

      // Cria o novo cargo no banco de dados
      const turma = await database.turmas.create({ name, ensino, turno, coordenador, escola });
      return httpResponse.created(turma);
    } catch (error) {
      return httpResponse.internalError(error);
    }
  }

  async update(req, res) {
    const httpResponse = new HttpResponse(res);
    try {
      const { id } = req.params;
      const { name, ensino, turno, coordenador, escola } = req.body;

      // Verifica se o usuário logado tem permissão de administrador
      const isCoordinator = await isSystemCoordinator(req.userId.id);
      if (!isCoordinator) {
        return httpResponse.forbidden("Você não tem permissão para esta ação.");
      }

      if (!id) {
        return httpResponse.badRequest("Parâmetros inválidos! Certifique-se de fornecer o ID do cargo.");
      }

      const turmaToUpdate = {};
      const turmaExists = await database.turmas.findByPk(id);
      if (!turmaExists) {
        return httpResponse.notFound("Cargo não encontrado! Verifique se o ID é válido.");
      }

      //
      if (name) {
        if (typeof name !== "string" || name.trim() === "") {
          return httpResponse.badRequest("Informe um nome para o cargo!");
        }
        turmaToUpdate.name = name;
      }
      if (ensino) turmaToUpdate.ensino = ensino;
      if (turno) turmaToUpdate.turno = turno;
      if (coordenador) turmaToUpdate.coordenador = coordenador;
      if (escola) turmaToUpdate.escola = escola;

      // Realiza a atualização no banco de dados
      await database.turmas.update(turmaToUpdate, {
        where: { id },
      });
      return httpResponse.ok({
        message: "Cargo atualizado com sucesso.",
      });
    } catch (error) {
      return httpResponse.internalError(error);
    }
  }

  async delete(req, res) {
    const httpResponse = new HttpResponse(res);
    try {
      const { id } = req.params;

      // Verifica se o usuário logado tem permissão de administrador
      const isCoordinator = await isSystemCoordinator(req.userId.id);
      if (!isCoordinator) {
        return httpResponse.forbidden("Você não tem permissão para esta ação.");
      }

      if (!id) {
        return httpResponse.badRequest("Parâmetros inválidos! Certifique-se de fornecer o ID do cargo.");
      }

      //
      const turmaExists = await database.turmas.findOne({
        where: { id },
      });

      //
      if (!turmaExists) {
        return httpResponse.notFound("Cargo não encontrado! Verifique se o ID é válido.");
      }

      // Realiza a exclusão do usuário no banco de dados
      await database.turmas.destroy({ where: { id } });
      return httpResponse.ok({
        message: "Cargo deletado com sucesso.",
      });
    } catch (error) {
      return httpResponse.internalError(error);
    }
  }
}

module.exports = TurmaController;
