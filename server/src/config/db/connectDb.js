import mongoose from "mongoose";

export default async function connectDb() {
  try {
    const url = process.env.DATABASE_URL;
    await mongoose.connect(url);
    console.log("connect successful!");
  } catch (err) {
    console.log("connect failure!");
  }
}
