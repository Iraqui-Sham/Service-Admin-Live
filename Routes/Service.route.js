import express from "express";
import { createService, deleteService, getAllService, getServiceById, updateService, getServiceBySlug } from "../Controller/ServiceController.js"
import { ServiceUpload } from "../Cloudnary/ClodnaryStorage.js";
const router = express.Router()

router.get("/", getAllService);
router.post("/create", ServiceUpload.single("image"), createService)
router.put("/:id", ServiceUpload.single("image"), updateService)
router.get("/slug/:slug", getServiceBySlug)
router.get("/:id", getServiceById)
router.delete("/:id", deleteService)

export default router