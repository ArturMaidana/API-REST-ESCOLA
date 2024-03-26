const { Router } = require("express");

// Importações de Serviços
const TurmaController = require("../controllers/TurmaController");
const { authMiddleware } = require("../security/authMiddleware");

const turmaController = new TurmaController();
const router = Router();

router.get("/turmas/all", authMiddleware, turmaController.getAll);
router.get("/turmas", authMiddleware, turmaController.get);
router.post("/turma", authMiddleware, turmaController.create);
router.put("/turma/:id", authMiddleware, turmaController.update);
router.delete("/turma/:id", authMiddleware, turmaController.delete);

module.exports = router;
