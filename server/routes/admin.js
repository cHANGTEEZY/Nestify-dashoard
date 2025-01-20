import express from "express";

import adminDetails from "../controllers/adminDetails.js";
import { authenticateToken } from "../middlewares/authorization.js";

const router = express.Router();

router.get("/admin-details", authenticateToken, adminDetails);


export default router;


