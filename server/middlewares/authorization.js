import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    console.log("token", token);
    const payload = jwt.verify(token, process.env.jwtSecretKey);

    req.userId = {
      id: payload.user,
    };

    next();
  } catch (error) {
    console.error(error.message);

    return res.status(403).json({ message: "Unauthorized" });
  }
};
