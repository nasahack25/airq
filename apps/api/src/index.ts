import "./oauth/passport"
import cookieParser from "cookie-parser";
import express, { Request, Response } from 'express';
import session from 'express-session';
import cors from 'cors';
import { FORECAST_SERVICE_URL, PORT } from './config';
import { ForecastRouter } from './routes/forecastRoutes';
import { UserRouter } from './routes/userRoutes';
import { OauthRouter } from './oauth/main';
import passport from "passport";
import { communityRouter } from "./routes/communityRoutes";

const app = express();

app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

// Session configuration
app.use(
    session({
        // secret: process.env.SESSION_SECRET || 'defaultsecret',
        secret: process.env.SESSION_SECRET as string,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
        },
    })
);


// Passport middlewares
app.use(passport.initialize());
app.use(passport.session());

app.use("/api", ForecastRouter);
app.use("/api/v1/auth/user", UserRouter);
app.use("/auth", OauthRouter);
app.use('/api/community', communityRouter);

app.listen(PORT, () => {
    console.log(`Node.js API Gateway listening on port ${PORT}`);
    console.log(`Forwarding forecast requests to: ${FORECAST_SERVICE_URL}`);
});
