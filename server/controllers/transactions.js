import { pool } from '../db.js';

export const transactions = async (req, res) => {
    try {
        const transactions = await pool.query('SELECT b.booking_id, u.user_name AS booked_by, p.title AS property_name, b.booking_start_date, b.booking_end_date,b.total_guests,b.total_price, b.booking_status,b.created_at,b.updated_at FROM  bookings b INNER JOIN  user_details u ON b.user_id = u.user_id INNER JOIN property_listing_details p ON b.property_id = p.property_id');
        res.json(transactions.rows)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Server Error");
    }
}

export const sales = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                DATE(booking_start_date) AS sales_date, 
                SUM(total_price) AS total_sales
            FROM bookings
            WHERE booking_status = 'Booked'
            GROUP BY sales_date
            ORDER BY sales_date;
        `);
        res.json(result.rows);
    } catch (error) {
        console.error(error.message)
    }
}