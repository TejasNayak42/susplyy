import express from "express";
import { getOrdersByCustomerId } from "../../controllers/Orders/OrderController.js";

const router = express.Router();
export { router as orderRouter };

router.get("/", getOrdersByCustomerId);
