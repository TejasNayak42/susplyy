import express from "express";
import {
  loginShippers,
  registerShippers,
  shipperInfo,
} from "../../controllers/authControllers/shippersController.js";
import { addShipment } from "../../controllers/Shipments/shipmentController.js";

const router = express.Router();
export { router as shipperRouter };

router.post("/register", registerShippers);
router.post("/login", loginShippers);
router.get("/info", (req, res) => {
  shipperInfo(req, (error, user) => {
    if (error) {
      return res
        .status(error.status || 500)
        .json({ message: error.message || "Error retrieving user info" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send the user object
    res.json(user);
  });
});
router.post("/addshipment", addShipment);
