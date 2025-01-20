import express from "express";
import {
  Properties,
  allProperties,
  updateProperty,
  deleteProperty,
  acceptProperties,
  rejectProperties,
} from "../controllers/properties.js";
import { authenticateToken } from "../middlewares/authorization.js";

const router = express.Router();

router.get("/", Properties);
router.delete("/accept/:propertyId", authenticateToken, acceptProperties);
router.put("/reject/:propertyId", authenticateToken, rejectProperties);
router.get("/all", allProperties);
router.put("/:id", updateProperty);
router.delete("/:id", deleteProperty);

export default router;
