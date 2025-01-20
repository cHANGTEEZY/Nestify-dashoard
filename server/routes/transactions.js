import express from 'express'
const router = express.Router();
import {transactions, sales } from '../controllers/transactions.js';

router.get("/", transactions);
router.get("/sales", sales)

export default router;