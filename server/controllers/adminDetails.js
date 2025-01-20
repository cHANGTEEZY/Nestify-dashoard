import { pool } from "../db.js";

const adminDetails = async (req, res) => {
    const admin = req.userId.id;
    console.log("admin", admin);
    const adminDetails = await pool.query("SELECT * from user_details WHERE user_id = $1", [admin]);
    if (!adminDetails.rows[0]) {
        return res.status(404).json({ message: "Admin not found" });
    }
    console.log("adminDetails", adminDetails.rows[0]);
    res.status(200).json({ data: adminDetails.rows[0] });
}

export default adminDetails;