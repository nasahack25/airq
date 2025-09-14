import { config } from "dotenv";
config();

export const PORT = process.env.PORT || 3001;
export const FORECAST_SERVICE_URL = process.env.FORECAST_SERVICE_URL as string;