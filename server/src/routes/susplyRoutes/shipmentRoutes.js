import express from "express";
import { getShipments } from "../../controllers/Shipments/shipmentController.js";

const router = express.Router();
export { router as shipmentRouter };

router.get("/", getShipments);
