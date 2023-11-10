import express from "express";
import authController from "../controllers/auth.controller.js";

const authRoute = express.Router();

authRoute.post("/google", authController.google);
authRoute.post("/sign-up", authController.signUp);
authRoute.post("/sign-in", authController.signIn);

export default authRoute;
