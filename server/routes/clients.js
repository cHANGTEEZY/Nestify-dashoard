import express from 'express';
const router = express.Router();
import { allClients, getClientById, updateClient, deleteClient } from '../controllers/clients.js';

router.get("/", allClients);
router.get("/:id", getClientById);
router.put("/:id", updateClient);
router.delete("/:id", deleteClient);

export default router;
