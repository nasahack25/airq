import { config } from "dotenv";
config();

export const PORT = process.env.PORT || 3001;
export const JWT_USER_SECRET = process.env.JWT_USER_SECRET as string;
export const FORECAST_SERVICE_URL = process.env.FORECAST_SERVICE_URL as string;
export const FRONTEND_URL = process.env.FRONTEND_URL as string;

export const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;