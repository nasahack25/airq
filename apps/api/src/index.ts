import express, { Request, Response } from 'express';
import cors from 'cors';
import { FORECAST_SERVICE_URL, PORT } from './config';
import { ForecastRouter } from './routes/forecastRoutes';

const app = express();

// Use CORS for cross-origin requests from the frontend
app.use(cors());
app.use(express.json());

app.use("/api", ForecastRouter);


app.listen(PORT, () => {
    console.log(`Node.js API Gateway listening on port ${PORT}`);
    console.log(`Forwarding forecast requests to: ${FORECAST_SERVICE_URL}`);
});
