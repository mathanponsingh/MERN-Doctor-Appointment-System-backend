import express from "express";
import {docter_register,docter_login, getProfile, registerAttendance} from '../controllers/docter_controller.js'
import { uploadProfile } from "../controllers/docter_controller.js";
import upload from "../middleware/multer_config.js";
import { refreshToken } from "../common/common.js";
import { protect } from "../middleware/authorization.js";


const router = express.Router()
router.post("/register", docter_register)
router.post("/login", docter_login)
router.post("/upload-profile", protect, upload.single("profile"), uploadProfile)
router.get("/profile", protect, getProfile)
router.post("/attendance", protect, upload.single("photo"), registerAttendance)
router.post("/refresh-token", refreshToken);

export default router;