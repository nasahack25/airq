import { Router } from "express";
import { getForecast } from "../controllers/forecastControllers";

export const ForecastRouter = Router();

ForecastRouter.get("/forecast" , getForecast);