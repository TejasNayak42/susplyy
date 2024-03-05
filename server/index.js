import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import DB from "./database.js";
import { userRouter } from "./src/routes/user.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", userRouter); // Authentication-related routes

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
