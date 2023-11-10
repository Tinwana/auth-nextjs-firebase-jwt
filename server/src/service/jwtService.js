import jwt from "jsonwebtoken";
export const generateAccessToken = (payload) => {
  const jwtSecret = process.env.JWT_SECRET;
  const token = jwt.sign({ payload }, jwtSecret, {
    expiresIn: "3600s",
  });
  return token;
};
export const generateRefreshToken = (payload) => {
  const jwtSecret = process.env.JWT_SECRET;
  const token = jwt.sign({ payload }, jwtSecret, {
    expiresIn: `${3600 * 3}s`,
  });
  return token;
};
export const refreshTokenService = (token) => {
  return new Promise((resolve, reject) => {
    const jwtSecret = process.env.JWT_SECRET;
    try {
      jwt.verify(token, jwtSecret, (error, user) => {
        if (error) {
          resolve({
            status: "error",
            message: "The Authentication!",
          });
        } else {
          const { payload } = user;
          const accessToken = generateAccessToken({
            id: payload?.id,
          });
          const refreshToken = generateRefreshToken({
            id: payload?.id,
          });
          resolve({
            status: "OK",
            message: "success",
            access_token: accessToken,
            refresh_token: refreshToken,
          });
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};
