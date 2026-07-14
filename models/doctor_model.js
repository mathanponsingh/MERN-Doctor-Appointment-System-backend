import mongoose from "mongoose";

const docterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  image:{
    type: String,
    default:""
  },
  description: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    default: "",
  },
  experience: {
    type: String,
    default: "",
  },
  attendanceImage: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const docterAttendanceSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Docter",
    required: true,
  },
  attendace : [{
    date: {
    type: Date,
    default: Date.now,
  },
  start: {
    type: String,
    default:""
  },
  end:{
    type: String,
    default :""
  },
  status: {
    type: String,
    enum: ["Present", "Absent"],
    default: "Absent",
  },
}]
})

export const DocterAttendance = mongoose.model(
  "DocterAttendance",
  docterAttendanceSchema
);

export const  Docter = mongoose.model("Docter", docterSchema);