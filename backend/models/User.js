import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["member", "manager", "unset"],
    default: "unset", // initially no role
  },
  employeeId: { type: String, required: true },
});

export default mongoose.model("User", userSchema);
