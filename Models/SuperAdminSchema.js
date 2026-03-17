import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const SuperadminSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "Name is required"],
        minlength: [3, "Name length must be greater than 3 characters"],
        maxlength: [30, "Name must be less than 30 characters"]
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },

    password: {
        type: String,
        required: [true, "Password is required"],
        select: false,
        minlength: [6, "Password must be at least 6 characters"]
    },

    role: {
        type: String,
        enum: ['Superadmin'],
        default: 'Superadmin'
    },

    image: {
        type: String,
        required: true
    },

    // 🔐 LOGIN TRACKING
    lastLogin: {
        type: Date
    },

    // 🔥 MULTI DEVICE SUPPORT (IMPORTANT)
    devices: [
        {
            deviceId: String,
            refreshToken: String,
            userAgent: String,
            ip: String,
            lastLogin: Date
        }
    ],

    // Location Info
    location: {
        city: String,
        region: String,
        country: String,
        coordinates: {
            lat: Number,
            lng: Number
        }
    },

    // Brute Force Protection
    loginAttempts: {
        type: Number,
        default: 0
    },

    lockUntil: Date,

    isActive: {
        type: Boolean,
        default: true
    }

}, { timestamps: true });

SuperadminSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    return 
});

const SuperAdmin = mongoose.model("SuperAdmin", SuperadminSchema);
export default SuperAdmin;
