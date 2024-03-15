import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { customerRouter } from "./src/routes/authRoutes/customerRoutes.js";
import { supplierRouter } from "./src/routes/authRoutes/supplierRoutes.js";
import { shipperRouter } from "./src/routes/authRoutes/shippersRoutes.js";
import { productRouter } from "./src/routes/susplyRoutes/productRoutes.js";
import { orderRouter } from "./src/routes/susplyRoutes/orderRoutes.js";
import { shipmentRouter } from "./src/routes/susplyRoutes/shipmentRoutes.js";
import { trackRouter } from "./src/routes/susplyRoutes/trackRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Authentication-related routes
app.use("/customer", customerRouter);
app.use("/supplier", supplierRouter);
app.use("/shipper", shipperRouter);
app.use("/products", productRouter);
app.use("/order", orderRouter);
app.use("/shipments", shipmentRouter);
app.use("/tracks", trackRouter);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
