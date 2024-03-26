const { Router } = require("express");

// Importações de Serviços
const AlunoController = require("../controllers/AlunoController");
const { authMiddleware } = require("../security/authMiddleware");

const alunoController = new AlunoController();
const router = Router();

router.get("/alunos/all", authMiddleware, alunoController.getAll);
router.get("/alunos/filter", authMiddleware, alunoController.getFilter);
router.get("/alunos", authMiddleware, alunoController.get);
router.post("/aluno", authMiddleware, alunoController.create);
router.put("/aluno/:id", authMiddleware, alunoController.update);
router.delete("/aluno/:id", authMiddleware, alunoController.delete);

module.exports = router;
