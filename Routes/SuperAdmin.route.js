import express from "express"
import { CreateSuperAdmin, GetSuperAdmin } from "../Controller/SuperAdmin.controller.js"
import upload from "../Cloudnary/ClodnaryStorage.js";
import { logout, SuperAdminLogin, VerifyOtp } from "../Controller/SuperAdminLogin.controller.js";
const Router = express.Router()


Router.post(
  "/create",
  upload.single("image"),
  CreateSuperAdmin
);
Router.get("/profile",GetSuperAdmin);
Router.post("/login",SuperAdminLogin)
Router.post("/verify/otp",VerifyOtp)
Router.get("/logout/:id",logout)
export default Router