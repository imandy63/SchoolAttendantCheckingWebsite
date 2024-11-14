import cloudinary from "cloudinary";
import * as dotenv from "dotenv";
dotenv.config();
const cloud = cloudinary.v2;

cloud.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SETRET_API_KEY,
});

export { cloud };
