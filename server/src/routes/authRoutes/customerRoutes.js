import express from "express";
import {
  loginCustomer,
  registerCustomer,
} from "../../controllers/authControllers/customerController.js";

const router = express.Router();
export { router as customerRouter };

router.post("/register", registerCustomer);
router.post("/login", loginCustomer);
