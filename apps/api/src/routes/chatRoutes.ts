import { Router } from "express";
import { handleChat } from "../controllers/chatControllers";
import { UserAuth } from "../middlewares/userAuthentication";

export const chatRouter = Router();

chatRouter.post("/", UserAuth, handleChat);
