import express from "express";
import {
  loginSupplier,
  registerSupplier,
} from "../../controllers/authControllers/supplierContoller.js";

const router = express.Router();
export { router as supplierRouter };

router.post("/register", registerSupplier);
router.post("/login", loginSupplier);
