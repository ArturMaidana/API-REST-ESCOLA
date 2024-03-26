// Importações de Serviços
const { HttpResponse } = require("../utils/httpResponse");
const database = require("../models");
const { isSystemCoordinator } = require("../utils/userUtils");

class AlunoController {
  async getAll(_, res) {
    const httpResponse = new HttpResponse(res);
    try {
      // Consulta o banco de dados para obter as informações ordenadas pelo nome
      const alunos = await database.alunos.findAll({
        order: [["name", "ASC"]],
      });

      return httpResponse.ok({ alunos });
    } catch (error) {
      return httpResponse.internalError(error);
    }
  }

  async getFilter(request, response) {
    const httpResponse = new HttpResponse(response);
    try {
        const { name, genero, turma } = request.query;

        const filter = {}
        if (name){
            filter.name = name;
        }
        if (genero) {
            filter.genero = genero;
        }
        if (turma) {
            filter.turma = turma;
        }

        // Busca todos os alunos no banco de dados com base nos filtros
        const alunos = await database.alunos.findAll({
            where: filter
        });
        
        return httpResponse.ok({ alunos });
    } catch (error) {
      return httpResponse.internalError(error);
    }}

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
      const { count, rows: alunos } = await database.alunos.findAndCountAll({
        order: [["name", "ASC"]],
        offset,
        limit: pageSize,
      });

      // Calcula a quantidade total de páginas com base na quantidade total de itens e no tamanho da página
      const totalPages = Math.ceil(count / pageSize);

      // Retorna a resposta, incluindo as informações do banco de dados, a quantidade total de páginas disponíveis e a página atual.
      return httpResponse.ok({
        alunos,
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
      const { name, genero, responsavel, telefone, turma } = req.body;

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
      const aluno = await database.alunos.create({ name, genero, responsavel, telefone, turma });
      return httpResponse.created(aluno);
    } catch (error) {
      return httpResponse.internalError(error);
    }
  }

  async update(req, res) {
    const httpResponse = new HttpResponse(res);
    try {
      const { id } = req.params;
      const { name, genero, responsavel, telefone, turma } = req.body;

      // Verifica se o usuário logado tem permissão de administrador
      const isCoordinator = await isSystemCoordinator(req.userId.id);
      if (!isCoordinator) {
        return httpResponse.forbidden("Você não tem permissão para esta ação.");
      }

      if (!id) {
        return httpResponse.badRequest("Parâmetros inválidos! Certifique-se de fornecer o ID do cargo.");
      }

      const alunoToUpdate = {};
      const alunoExists = await database.alunos.findByPk(id);
      if (!alunoExists) {
        return httpResponse.notFound("Cargo não encontrado! Verifique se o ID é válido.");
      }

      //
      if (name) {
        if (typeof name !== "string" || name.trim() === "") {
          return httpResponse.badRequest("Informe um nome para o cargo!");
        }
        alunoToUpdate.name = name;
      }
      if (genero) alunoToUpdate.genero = genero;
      if (responsavel) alunoToUpdate.responsavel = responsavel;
      if (telefone) alunoToUpdate.telefone = telefone;
      if (turma) alunoToUpdate.turma = turma;

      // Realiza a atualização no banco de dados
      await database.alunos.update(alunoToUpdate, {
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
      const alunoExists = await database.alunos.findOne({
        where: { id },
      });

      //
      if (!alunoExists) {
        return httpResponse.notFound("Cargo não encontrado! Verifique se o ID é válido.");
      }

      // Realiza a exclusão do usuário no banco de dados
      await database.alunos.destroy({ where: { id } });
      return httpResponse.ok({
        message: "Cargo deletado com sucesso.",
      });
    } catch (error) {
      return httpResponse.internalError(error);
    }
  }
}

module.exports = AlunoController;
