import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudnary from "./CloudnaryConfig.js"; // <--- Spelling check: 'Cloudinary' (not 'Cloudnary')
import multer from "multer";

const storage = new CloudinaryStorage({
    cloudinary: cloudnary,
    params: {
        folder: "superAdmin",
        allowed_formats: ["jpg", "png", "jpeg", "webp"],
    },
});
export const upload = multer({ storage });


const AdminStorage = new CloudinaryStorage({
    cloudinary: cloudnary,
    params: async (req, file) => {
        let folder = "Admin";

        if (file.fieldname === "image") {
            folder = "Admin/Profile";
        } else if (file.fieldname === "aadharFile") {
            folder = "Admin/Documents/Aadhar";
        } else if (file.fieldname === "panFile") {
            folder = "Admin/Documents/PAN";
        } else if (file.fieldname === "passbookFile") {
            folder = "Admin/Documents/Passbook";
        } else if (file.fieldname === "agreementFile") {
            folder = "Admin/Documents/Agreement";
        }

        return {
            folder: folder,
            resource_type: "auto",
            allowed_formats: ["jpg", "png", "jpeg", "webp", "pdf"],
        };
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "application/pdf",
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only images and PDF files are allowed"), false);
    }
};

const adminUpload = multer({
    storage: AdminStorage,

    limits: {
        fileSize: 2 * 1024 * 1024, // 🔥 2MB limit per file
    },

    fileFilter,
});

export default adminUpload;

const CategoryStorage = new CloudinaryStorage({
    cloudinary: cloudnary,
    parmas: {
        folder: "Category",
        allowed_formats: ["jpg", "png", "jpeg", "webp"]
    }
})

export const Categoryupload = multer({
    storage: CategoryStorage,
    limits: 2 * 1024 * 1024
})

const Service = new CloudinaryStorage({
    cloudinary: cloudnary,
    params: {
        folder: "service",
        allowed_formats: ["jpg", "png", "jpeg", "webp"]
    }
})

export const ServiceUpload = multer({
    storage: Service,
    limits: 2 * 1024 * 1024
});