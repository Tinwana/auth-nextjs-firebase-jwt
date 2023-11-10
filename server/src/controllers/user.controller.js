import argon2 from "argon2";
import User from "../models/user.model.js";
import { refreshTokenService } from "../service/jwtService.js";
import { isValidObjectId } from "mongoose";

class userController {
  async getAll(req, res, next) {
    try {
      const allUsers = await User.findAll();
      if (allUsers) {
        res.status(200).json({
          status: "OK",
          message: "get All users successfully!",
          data: allUsers,
        });
      }
    } catch (error) {
      next(error);
    }
  }
  async getDetailUser(req, res, next) {
    try {
      const userId = req.params.userId;
      const user = await User.findOne({ _id: userId });
      if (!userId) {
        return res.status(400).json({
          status: "error",
          message: "user di param is required!",
        });
      } else if (user === null) {
        return res.status(404).json({
          status: "error",
          message: "User not found!",
        });
      } else {
        return res.status(200).json({
          status: "OK",
          message: "User has found!",
          data: user,
        });
      }
    } catch (error) {
      next(error);
    }
  }
  async refreshToken(req, res, next) {
    try {
      const token = req.cookies.refresh_token;
      if (!token) {
        return res.status(200).json({
          status: "OK",
          message: "Token is required!",
        });
      } else {
        const response = await refreshTokenService(token);
        if (response.status === "OK") {
          const expiryTime = new Date(Date.now() + 3600000 * 3);
          res
            .cookie("refresh_token", response.refresh_token, {
              httpOnly: true,
              expires: expiryTime,
              samesite: "strict",
            })
            .status(200)
            .json({
              status: "OK",
              message: "created successfully",
              access_token: response.access_token,
            });
        } else {
          return res.status(400).json({
            status: "error",
            message: "Expires token",
          });
        }
      }
    } catch (error) {
      next(error);
    }
  }
  async updateUser(req, res, next) {
    try {
      const userId = req.params.userId;
      const user = await User.findOne({ _id: userId });
      if (!userId) {
        return res.status(400).json({
          status: "error",
          message: "user di param is required!",
        });
      } else if (user === null) {
        return res.status(404).json({
          status: "error",
          message: "User not found!",
        });
      } else {
        const hash =
          req.body.password === ""
            ? user.password
            : await argon2.hash(req.body.password);
        const updateUser = await User.findOneAndUpdate(
          { _id: userId },
          {
            username: req.body.username,
            email: req.body.email,
            password: hash,
            avatar: req.body.avatar,
          },
          {
            new: true,
          }
        );
        return res.status(200).json({
          status: "OK",
          message: "User has update!",
          data: updateUser,
        });
      }
    } catch (error) {
      next(error);
    }
  }
  async deleteUser(req, res, next) {
    try {
      const userId = req.params.userId;
      const user = await User.findOne({ _id: userId });
      if (!userId) {
        return res.status(400).json({
          status: "error",
          message: "user di param is required!",
        });
      } else if (user === null) {
        return res.status(404).json({
          status: "error",
          message: "User not found!",
        });
      } else {
        const deleteUser = await User.findByIdAndDelete({ _id: userId });
        return res.status(200).json({
          status: "OK",
          message: "User has delete!",
        });
      }
    } catch (error) {
      next(error);
    }
  }
}

export default new userController();
