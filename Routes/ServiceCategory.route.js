import express from "express";
import {
  CreateCategory,
  GetAllCategory,
  GetCategoryById,
  UpdateCategory,
  DeleteCategory,
  ToggleCategoryStatus,
} from "../Controller/ServiceCategory.controller.js";
import CategoryUpload from "../Cloudnary/ClodnaryStorage.js";


const router = express.Router();

router.post("/create", CategoryUpload.single("image"), CreateCategory);

router.get("/all", GetAllCategory);

router.get("/:id", GetCategoryById);

router.put("/update/:id", CategoryUpload.single("image"), UpdateCategory);

router.delete("/delete/:id", DeleteCategory);

router.patch("/toggle/:id", ToggleCategoryStatus);

export default router;