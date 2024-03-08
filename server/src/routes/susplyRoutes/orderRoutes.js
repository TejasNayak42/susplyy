import express from "express";
import { getOrdersByCustomerId } from "../../controllers/Orders/OrderController.js";

const router = express.Router();
export { router as orderRouter };

//The below route i shifted to customerRoutes since that is better
//router.post("/placeorder", placeOrder);<-- this wont even if u uncomment it

router.get("/", getOrdersByCustomerId);
