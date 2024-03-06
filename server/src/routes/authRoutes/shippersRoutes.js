import express from "express";
import {
  loginShippers,
  registerShippers,
} from "../../controllers/authControllers/shippersController.js";

const router = express.Router();
export { router as shipperRouter };

router.post("/register", registerShippers);
router.post("/login", loginShippers);
