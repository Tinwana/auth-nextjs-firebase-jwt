import express from "express";
import userController from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const userRoute = express.Router();

userRoute.delete("/delete/:userId", userController.deleteUser);
userRoute.put("/update/:userId", authMiddleware, userController.updateUser);
userRoute.get("/get-detail/:userId", userController.getDetailUser);
userRoute.post("/refresh-token", userController.refreshToken);
userRoute.get("/get-all", userController.getAll);

export default userRoute;
