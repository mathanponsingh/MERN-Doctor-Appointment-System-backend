import jwt from "jsonwebtoken";
import {Docter} from "../models/doctor_model.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    // Authorization: Bearer <token>
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "Not authorized. Token missing.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const doctor = await Docter.findById(decoded.id).select("-password");

    if (!doctor) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    req.user = doctor;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};