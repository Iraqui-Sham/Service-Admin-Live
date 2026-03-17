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

const upload = multer({ storage });

export default upload;