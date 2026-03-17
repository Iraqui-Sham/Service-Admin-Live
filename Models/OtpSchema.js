import mongoose from "mongoose";

const OtpSchema = mongoose.Schema({
    email: String,
    otp: String,
    expiresAt: Date
})

const OTP = mongoose.model("OTP", OtpSchema);
export default OTP;
