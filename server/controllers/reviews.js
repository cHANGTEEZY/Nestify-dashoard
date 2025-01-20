import { pool } from "../db.js";

export const allReviews = async (req, res) => {
    try {
        const allReviews = await pool.query(` SELECT 
          r.review_id, 
          r.rating, 
          r.review_message, 
          r.review_date_time, 
          u.user_name, 
          p.title AS property_title
            FROM reviews r
            JOIN user_details u ON r.user_id = u.user_id
            JOIN property_listing_details p ON r.property_id = p.property_id
            ORDER BY r.review_date_time DESC;`)
        res.json(allReviews.rows)

    } catch (error) {
        console.error(error.message)
    }
}