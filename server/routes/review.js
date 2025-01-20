import express from 'express'
const router = express.Router();
import { allReviews } from '../controllers/reviews.js'

router.get("/", allReviews)

export default router;