import { pool } from "../db.js";

export const Properties = async (req, res) => {
  try {
    const Properties = await pool.query(`
      SELECT p.title, p.property_type, p.price,p.pending_property_id,p.property_region,p.approximate_location, u.user_id,u.user_name AS hosted_by
      FROM pending_property_listing_details p
      INNER JOIN user_details u ON p.user_id = u.user_id WHERE property_status='Pending';
    `);

    if (Properties.rows.length === 0) {
      console.log("No properties found.");
      return res.status(404).json({ message: "No properties available." });
    }

    res.json(Properties.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

export const acceptProperties = async (req, res) => {
  const { propertyId } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM pending_property_listing_details WHERE pending_property_id = $1",
      [propertyId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Property not found." });
    }

    const property = result.rows[0];

    await pool.query(
      `INSERT INTO property_listing_details (
        user_id, property_type, title, property_region, approximate_location,
        latitude, longitude, price, guests, bedrooms, beds, bathrooms, kitchens,
        swimming_pool, amenities, image_urls, created_at, update_at, averate_review_rating
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19
      )`,
      [
        property.user_id,
        property.property_type,
        property.title,
        property.property_region,
        property.approximate_location,
        property.latitude,
        property.longitude,
        property.price,
        property.guests,
        property.bedrooms,
        property.beds,
        property.bathrooms,
        property.kitchens,
        property.swimming_pool,
        property.amenities,
        property.image_urls,
        property.created_at,
        property.update_at,
        property.averate_review_rating,
      ]
    );

    await pool.query(
      "DELETE FROM pending_property_listing_details WHERE pending_property_id = $1",
      [propertyId]
    );

    res
      .status(200)
      .json({ message: "Property accepted and moved to listings." });
  } catch (error) {
    console.error("Error accepting property:", error);
    res.status(500).json({ message: "Failed to accept property." });
  }
};

export const rejectProperties = async (req, res) => {
  const adminId = req.userId.id;
  const { propertyId } = req.params;
  const { reason, userId } = req.body;

  try {
    await pool.query(
      `UPDATE pending_property_listing_details
       SET property_status = $1, update_at = CURRENT_TIMESTAMP
       WHERE pending_property_id = $2`,
      ["Rejected", propertyId]
    );

    await pool.query(
      "INSERT into admin_host_messages (admin_id,host_id,rejected_property_id,rejection_reason) VALUES ($1,$2,$3,$4)",
      [adminId, userId, propertyId, reason]
    );

    res.status(200).json({ message: "Property rejected successfully." });
  } catch (error) {
    console.error("Error rejecting property:", error);
    res.status(500).json({ message: "Failed to reject property." });
  }
};

export const allProperties = async (req, res) => {
  try {
    const allProperties = await pool.query(
      `
      SELECT p.*, u.user_name 
      FROM property_listing_details p
      JOIN user_details u ON p.user_id = u.user_id
      ORDER BY p.created_at DESC
      `
    );
    res.json(allProperties.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

export const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, property_type, price } = req.body;

    const updateQuery = `
      UPDATE property_listing_details 
      SET title = $1, property_type = $2, price = $3 
      WHERE property_id = $4 
      RETURNING *
    `;

    const updatedProperty = await pool.query(updateQuery, [
      title,
      property_type,
      price,
      id,
    ]);

    if (updatedProperty.rows.length === 0) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json(updatedProperty.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

export const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const deleteQuery = `
      DELETE FROM property_listing_details 
      WHERE property_id = $1 
      RETURNING *
    `;

    const deletedProperty = await pool.query(deleteQuery, [id]);

    if (deletedProperty.rows.length === 0) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};
