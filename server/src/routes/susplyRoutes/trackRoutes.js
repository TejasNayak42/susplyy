import express from "express";
import {
  getTrackInfo,
  populateTracks,
  updateTrackStatus,
} from "../../controllers/Tracks/trackController.js";

const router = express.Router();
export { router as trackRouter };
router.post("/addtracks", populateTracks);
router.patch("/updatetrack", updateTrackStatus);
router.get("/info", getTrackInfo);
