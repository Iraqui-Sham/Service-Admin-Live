import express from "express";
import {
    CreateAdmin,
    GetAllAdmins,
    GetAdminById,
    UpdateAdmin,
    DeleteAdmin,
    UpdateAdminStatus
} from "../Controller/Admin.controller.js";

import adminUpload from "../Cloudnary/ClodnaryStorage.js"
const router = express.Router();

router.post(
    "/create",
    adminUpload.fields([
        { name: "image", maxCount: 1 },
        { name: "aadharFile", maxCount: 1 },
        { name: "panFile", maxCount: 1 },
        { name: "passbookFile", maxCount: 1 },
        { name: "agreementFile", maxCount: 1 },
    ]),
    CreateAdmin
);
router.get("/all", GetAllAdmins);

router.get("/:id", GetAdminById);

router.put("/update/:id", adminUpload.fields([
    { name: "image", maxCount: 1 },
    { name: "aadharFile", maxCount: 1 },
    { name: "panFile", maxCount: 1 },
    { name: "passbookFile", maxCount: 1 },
    { name: "agreementFile", maxCount: 1 },
]), UpdateAdmin);

router.delete("/delete/:id", DeleteAdmin);
router.patch("/status/:id", UpdateAdminStatus);

export default router;