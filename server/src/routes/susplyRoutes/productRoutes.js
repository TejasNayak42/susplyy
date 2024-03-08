import express from "express";
import { getProducts } from "../../controllers/Products/productContoller.js";

const router = express.Router();
export { router as productRouter };

router.get("/", getProducts);
