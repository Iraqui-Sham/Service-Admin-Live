import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, "Name must be at least 3 characters"],
      maxLength: [30, "Name must be less than 30 characters"],
    },

    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
        "Please use a valid email address",
      ],
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [
        /^[6-9]\d{9}$/,
        "Please enter a valid 10-digit Indian phone number",
      ],
    },

    fatherName: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, "Father name must be at least 3 characters"],
      maxLength: [30, "Father name must be less than 30 characters"],
    },

    aadharNumber: {
      type: String,
      unique: true,
      trim: true,
      match: [
        /^\d{12}$/,
        "Aadhar must be exactly 12 digits",
      ],
    },

    panNumber: {
      type: String,
      unique: true,
      trim: true,
      uppercase: true,
      match: [
        /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
        "Invalid PAN format (ABCDE1234F)",
      ],
    },

    address: {
      state: String,
      district: String,
      subDistrict: String,
      ps: String,
      panchayat: String,
      village: String,
      pincode: {
        type: String,
        match: [/^\d{6}$/, "Invalid pincode"],
      },
    },

    documents: {
      aadharFile: String,
      panFile: String,
      passbookFile: String,
      agreementFile: String,
    },

    bankDetails: {
      accountHolderName: String,
      accountNumber: {
        type: String,
        match: [/^\d{9,18}$/, "Invalid account number"],
      },
      ifscCode: {
        type: String,
        uppercase: true,
        match: [
          /^[A-Z]{4}0[A-Z0-9]{6}$/,
          "Invalid IFSC Code",
        ],
      },
      bankName: String,
      branch: String,
    },

    password: {
      type: String,
      required: true,
      minLength: [6, "Password must be at least 6 characters"],
      select :false
    },

    role: {
      type: String,
      enum: ["admin"],
      default: "admin",
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive", "blocked"],
      default: "active",
    },

    lastLogin: {
      type: Date,
    },

    deviceInfo: {
      ip: String,
      browser: String,
      os: String,
    },
    image:{
      type:String,
      required:true
    }
  },
  { timestamps: true }
);


adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default mongoose.model("Admin", adminSchema);