import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { userRouter } from "./src/routes/user.js";
import { customerRouter } from "./src/routes/authRoutes/customerRoutes.js";
import { supplierRouter } from "./src/routes/authRoutes/supplierRoutes.js";
import { shipperRouter } from "./src/routes/authRoutes/shippersRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Authentication-related routes
app.use("/auth", userRouter);
app.use("/customer", customerRouter);
app.use("/supplier", supplierRouter);
app.use("/shipper", shipperRouter);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
