import { pool } from '../db.js';

// Get all clients
export const allClients = async (req, res) => {
    try {
        const allClients = await pool.query('SELECT * FROM user_details');

        if (allClients.rows.length === 0) {
            console.log("No clients found");
            return res.status(404).json({ message: "No Clients Found" });
        }

        res.json(allClients.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
};

// Get a single client by ID
export const getClientById = async (req, res) => {
    const { id } = req.params;
    try {
        const client = await pool.query('SELECT * FROM user_details WHERE user_id = $1', [id]);

        if (client.rows.length === 0) {
            console.log("Client not found");
            return res.status(404).json({ message: "Client not found" });
        }

        res.json(client.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
};

// Update a client
export const updateClient = async (req, res) => {
    const { id } = req.params;
    const { user_name, user_email, user_password } = req.body;
    try {
        const updateClient = await pool.query(
            'UPDATE user_details SET user_name = $1, user_email = $2, user_password = $3 WHERE user_id = $4 RETURNING *',
            [user_name, user_email, user_password, id]
        );

        if (updateClient.rows.length === 0) {
            console.log("Client not found");
            return res.status(404).json({ message: "Client not found" });
        }

        res.json(updateClient.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
};

// Delete a client
export const deleteClient = async (req, res) => {
    const { id } = req.params;
    try {
        const deleteClient = await pool.query('DELETE FROM user_details WHERE user_id = $1 RETURNING *', [id]);

        if (deleteClient.rows.length === 0) {
            console.log("Client not found");
            return res.status(404).json({ message: "Client not found" });
        }

        res.json({ message: "Client deleted successfully", client: deleteClient.rows[0] });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
};
