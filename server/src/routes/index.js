import authRoute from "./auth.route .js";
import userRoute from "./user.route.js";

export const route = (app) => {
  app.use("/api/users", userRoute);
  app.use("/api/auth", authRoute);
};
