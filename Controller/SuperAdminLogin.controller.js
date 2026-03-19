import dotenv from "dotenv"
dotenv.config()
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { SendEmail } from "../Utils/Utils.js"
import SuperAdmin from "../Models/SuperAdminSchema.js"
import crypto from "crypto";
import OTP from "../Models/OtpSchema.js";
import { v4 as uuidv4 } from "uuid"

export const SuperAdminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const SAdmin = await SuperAdmin.findOne({ email }).select("+password")
        if (!SAdmin) return res.status(401).json({ success: false, message: "Super Amin Not Found" })

        const Ismatch = await bcrypt.compare(password, SAdmin.password)
        if (!Ismatch) return res.status(401).json({ success: false, message: "Password Did Not Match" })

        const otp = crypto.randomInt(100000, 999999);

        const SavedOtp = await OTP.create({
            email,
            otp,
            expiresAt: Date.now() + 5 * 60 * 1000  // 5 min
        })

        if (!SavedOtp) return res.status(401).json({ success: false, message: "DataBase Error:Otp Not Saved in db " })

        const SendOtp = await SendEmail(email, otp)
        if (SendOtp.success == true) {
            return res.status(201).json({ success: SendOtp.success, message: SendOtp.message })
        } else {
            return res.status(401).json({ success: SendOtp.success, message: SendOtp.message })
        }
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message || "Login Internal Server Problem",
        })
    }
}
// Verify OTP & login
export const VerifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const record = await OTP.findOne({ email });
        if (!record) return res.status(401).json({
            success: false,
            message: "Invalid OTP"
        });

        if (record.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP ❌"
            });
        }

        // OTP expiry check
        if (record.expiresAt < Date.now()) {
            return res.status(400).json({ success: false, message: "OTP expired" });
        }

        // Admin check
        const admin = await SuperAdmin.findOne({ email });
        if (!admin) return res.status(401).json({
            success: false,
            message: "Super Admin Not Found",
        });

        // JWT Tokens
        const accessToken = jwt.sign(
            { id: admin._id, role: admin.role },
            process.env.ACCESS_SECRET,
            { expiresIn: "18h" }
        );

        const refreshToken = jwt.sign(
            { id: admin._id, role: admin.role },
            process.env.REFRESH_SECRET,
            { expiresIn: "7d" }
        );

        // Device tracking
        const deviceId = uuidv4();
        const deviceData = {
            deviceId,
            refreshToken,
            userAgent: req.headers["user-agent"],
            ip: req.ip,
            lastLogin: new Date()
        };

        if (admin.devices.length >= 2) {
            admin.devices.shift();
        }

        admin.devices.push(deviceData);
        admin.lastLogin = new Date();
        await admin.save();

        await OTP.deleteMany({ email });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 18 * 60 * 60 * 1000
        });
        // Response
        res.json({
            success: true,
            accessToken,
            deviceId,
            message: "Login successful"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message || "Problem in OTP verification"
        });
    }
};
export const logout = async (req, res) => {
    try {
        const userId = req.params;

        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(400).json({ success: false, message: "No refresh token found" });
        }

        const admin = await SuperAdmin.findById(userId);
        if (!admin) return res.status(404).json({ success: false, message: "Admin not found" });

        admin.devices = admin.devices.filter(d => d.refreshToken !== refreshToken);
        await admin.save();

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict"
        });

        res.json({ success: true, message: "Logged out successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message || "Error in logout" });
    }
};