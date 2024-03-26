// Importações de Serviços
const { HttpResponse } = require("../utils/httpResponse");
const database = require("../models");
const { isSystemCoordinator } = require("../utils/userUtils");

class CarsController {
  async getAll(_, res) {
    const httpResponse = new HttpResponse(res);
    try {
      // Consulta o banco de dados para obter as informações ordenadas pelo nome
      const cars = await database.cars.findAll({
        order: [["name", "ASC"]],
      });

      return httpResponse.ok({ cars });
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
      const { count, rows: cars } = await database.cars.findAndCountAll({
        order: [["name", "ASC"]],
        offset,
        limit: pageSize,
      });

      // Calcula a quantidade total de páginas com base na quantidade total de itens e no tamanho da página
      const totalPages = Math.ceil(count / pageSize);

      // Retorna a resposta, incluindo as informações do banco de dados, a quantidade total de páginas disponíveis e a página atual.
      return httpResponse.ok({
        cars,
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
      const { name, estado, cidade, cpf, email, telefone } = req.body;

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
      const car = await database.cars.create({ name, estado, cidade, cpf, email, telefone });
      return httpResponse.created(car);
    } catch (error) {
      return httpResponse.internalError(error);
    }
  }

  async update(req, res) {
    const httpResponse = new HttpResponse(res);
    try {
      const { id } = req.params;
      const { name, estado, cidade, cpf, email, telefone } = req.body;

      // Verifica se o usuário logado tem permissão de administrador
      const isCoordinator = await isSystemCoordinator(req.userId.id);
      if (!isCoordinator) {
        return httpResponse.forbidden("Você não tem permissão para esta ação.");
      }

      if (!id) {
        return httpResponse.badRequest("Parâmetros inválidos! Certifique-se de fornecer o ID do cargo.");
      }

      const carsToUpdate = {};
      const carsExists = await database.cars.findByPk(id);
      if (!carsExists) {
        return httpResponse.notFound("Cargo não encontrado! Verifique se o ID é válido.");
      }

      //
      if (name) {
        if (typeof name !== "string" || name.trim() === "") {
          return httpResponse.badRequest("Informe um nome para o cargo!");
        }
        carsToUpdate.name = name;
      }
      if (estado) carsToUpdate.estado = estado;
      if (cidade) carsToUpdate.cidade = cidade;
      if (cpf) carsToUpdate.cpf = cpf;
      if (email) carsToUpdate.email = email;
      if(telefone) carsToUpdate.telefone = telefone;

      // Realiza a atualização no banco de dados
      await database.cars.update(carsToUpdate, {
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
      const carsExists = await database.cars.findOne({
        where: { id },
      });

      //
      if (!carsExists) {
        return httpResponse.notFound("Cargo não encontrado! Verifique se o ID é válido.");
      }

      // Realiza a exclusão do usuário no banco de dados
      await database.cars.destroy({ where: { id } });
      return httpResponse.ok({
        message: "Cargo deletado com sucesso.",
      });
    } catch (error) {
      return httpResponse.internalError(error);
    }
  }
}

module.exports = CarsController;
