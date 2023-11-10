import jwt from "jsonwebtoken";
import { isValidObjectId } from "mongoose";
export const authMiddleware = (req, res, next) => {
  const token = req.headers.token.split(" ")[1];
  const userId = req.params.userId ? req.params.userId : null;
  const checkId = isValidObjectId(userId);
  if (!checkId) {
    return res.status(404).json({
      status: "error",
      message: "This account can not update!",
    });
  }
  jwt.verify(token, process.env.JWT_SECRET, async function (err, user) {
    if (err) {
      return res.status(200).json({
        status: "error",
        message: "The Authentication Error occurred!",
      });
    } else {
      const { payload } = user;
      // const currentUser = await User.findById(payload?.id);
      if (payload?.id === userId) {
        // req.user = currentUser;
        next();
      } else {
        return res.status(200).json({
          status: "error",
          message: "The Authentication Error occurred!",
        });
      }
    }
  });
};
