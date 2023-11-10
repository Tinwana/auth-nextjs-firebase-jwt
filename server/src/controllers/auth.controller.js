import User from "../models/user.model.js";
import argon2 from "argon2";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../service/jwtService.js";
class authController {
  async signUp(req, res, next) {
    try {
      const { username, email, password } = req.body;
      const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      const hash = await argon2.hash(password, {
        type: argon2.argon2d,
        memoryCost: 2 ** 16,
        hashLength: 50,
      });
      const checkEmail = regexEmail.test(req.body.email);
      const checkUser = await User.findOne({
        $or: [{ email: email }, { username: username }],
      });
      if (!username || !email || !password) {
        return res.status(401).json({
          status: "error",
          message: "Input is required!",
        });
      }
      if (!checkEmail) {
        return res.status(401).json({
          status: "error",
          message: "Invalid email address",
        });
      }
      if (checkUser !== null) {
        return res.status(401).json({
          status: "error",
          message: "User already in use",
        });
      }
      const createUser = await User.create({ username, email, password: hash });
      if (createUser) {
        return res.status(200).json({
          status: "OK",
          message: "created successfully",
          data: createUser,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async signIn(req, res, next) {
    try {
      const { email, password } = req.body;
      const checkUser = await User.findOne({ email: email });
      if (!email || !password) {
        return res.status(401).json({
          status: "error",
          message: "Input is required!",
        });
      }
      if (checkUser === null) {
        return res.status(401).json({
          status: "error",
          message: "User not found!",
        });
      } else {
        if (await argon2.verify(checkUser.password, password)) {
          const accessToken = generateAccessToken({ id: checkUser._id });
          const refreshToken = generateRefreshToken({ id: checkUser._id });
          const expiryTime = new Date(Date.now() + 3600000 * 3);
          const { password, ...rest } = checkUser._doc;
          res
            .cookie("refresh_token", refreshToken, {
              httpOnly: true,
              expires: expiryTime,
              samesite: "strict",
            })
            .status(200)
            .json({
              status: "OK",
              message: "created successfully",
              access_token: accessToken,
              data: rest,
            });
        } else {
          return res.status(401).json({
            status: "error",
            message: "Passwords do not match!",
          });
        }
      }
    } catch (error) {
      next(error);
    }
  }
  async google(req, res, next) {
    try {
      const { id } = req.body;
      const accessToken = generateAccessToken({ id: id });
      const refreshToken = generateRefreshToken({ id: id });
      const expiryTime = new Date(Date.now() + 3600000 * 3);
      res
        .cookie("refresh_token", refreshToken, {
          httpOnly: true,
          expires: expiryTime,
          samesite: "strict",
        })
        .status(200)
        .json({
          status: "OK",
          message: "created successfully",
          access_token: accessToken,
        });
    } catch (error) {
      next(error);
    }
  }
}

export default new authController();
