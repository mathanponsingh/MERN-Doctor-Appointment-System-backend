import { Docter }  from "../models/doctor_model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import generateToken from "../generate_token/generate_token.js"

export const docter_register = async ( req, res )=>{
    const { fullName : name, email, password } = req.body
    try {
        if(!name || !email || !password) {
            return res.status(400).json({ message: "Please fill all the fields" })
        }
        const userExists = await Docter.findOne({ email })
        if(userExists) {
            return res.status(400).json({ message: "User already exists" })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await Docter.create({
            name,
            email,
            password: hashedPassword
        })
        if(user) {
          return res.status(201).json({ status: 201, message: "User created successfully" })
        }
    }
    catch (error) {
        return res.status(500).json({ status: 500, message: "Server error" })
    }
}

export const docter_login = async ( req, res )=>{
    console.log("Logging in with:", req.body);
    const { email, password } = req.body
    try {
        if( !email || !password ) {
            return res.status(401).json({ status: 401, message: "Please fill all the fields" })
        }
        const existingUser = await Docter.findOne({ email })
        if(!existingUser) {
            return res.status(401).json({status: 401, message: "User does not exist" })
        }
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)
        if(!isPasswordCorrect) {
            return res.status(401).json({ status: 401, message: "Invalid credentials" })
        }
        const { token, refreshToken } = generateToken(res, existingUser._id)
        
        return res.status(200).json({ status: 200, message: "Login successful", token, refreshToken })
    }catch (error) {
      return res.status(500).json({ status: 500, message: "Server error" })
    }
}

export const uploadProfile = async (req, res) => {
  try {
    const { name, description, role, experience } = req.body;

    const updateData = {};

    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (role) updateData.role = role;
    if (experience) updateData.experience = experience;

    if (req.file) {
      const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
      updateData.image = imageUrl; // ✅ matches schema field name
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message: "No data provided to update",
      });
    }

    const updatedDocter = await Docter.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    ).select("-password");

    return res.status(200).json({
      message: "Profile updated successfully",
      doctor: updatedDocter,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const getProfile = async (req, res) => {
    const doctorId = req.user.id;
    try {
        const doctor = await Docter.findById(doctorId).select("-password");
        if (!doctor) {
            return res.status(404).json({ message: "Docter not found" });
        }
        return res.status(200).json({ doctor });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
}

export const registerAttendance = async (req, res) => {
  const doctorId = req.user.id;
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No photo uploaded" });
    }
    const existingDoctor = await Docter.findById(doctorId);
    if (!existingDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    const existingAttendance = await Docter.findOne({ _id: doctorId, attendanceImage: { $exists: true, $ne: "" } });
    if (existingAttendance) {
      return res.status(400).json({ message: "Attendance photo already uploaded" });
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    console.log("Attendance photo URL:", imageUrl);
    const registerAttandanceImage = await Docter.findByIdAndUpdate(
      doctorId,
      { attendanceImage: imageUrl },
      { new: true }
    );

    return res.status(200).json({
      message: "Attendance photo uploaded successfully",
      photoUrl: imageUrl,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
}
