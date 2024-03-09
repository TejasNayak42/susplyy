import express from "express";
import {
  loginSupplier,
  registerSupplier,
  supplierInfo,
} from "../../controllers/authControllers/supplierContoller.js";
import { addProduct } from "../../controllers/Products/productContoller.js";

const router = express.Router();
export { router as supplierRouter };

router.post("/register", registerSupplier);
router.post("/login", loginSupplier);
router.get("/info", (req, res) => {
  supplierInfo(req, (error, user) => {
    if (error) {
      // Handle errors appropriately (e.g., send error response)
      return res
        .status(error.status || 500)
        .json({ message: error.message || "Error retrieving user info" });
    }

    if (!user) {
      // Handle user not found case
      return res.status(404).json({ message: "User not found" });
    }

    // Send the user object
    res.json(user);
  });
});
router.post("/addProducts", addProduct);
