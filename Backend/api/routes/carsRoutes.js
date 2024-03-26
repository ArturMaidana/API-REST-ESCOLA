const { Router } = require("express");

// Importações de Serviços
const CarsController = require("../controllers/CarsController");
const { authMiddleware } = require("../security/authMiddleware");

const carsController = new CarsController();
const router = Router();

router.get("/cars/all", authMiddleware, carsController.getAll);
router.get("/cars", authMiddleware, carsController.get);
router.post("/car", authMiddleware, carsController.create);
router.put("/car/:id", authMiddleware, carsController.update);
router.delete("/car/:id", authMiddleware, carsController.delete);

module.exports = router;
