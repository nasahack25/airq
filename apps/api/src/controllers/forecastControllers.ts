import { Request, Response } from "express";
import { FORECAST_SERVICE_URL } from "../config";
import axios from 'axios';

/**
 * (route) GET /api/forecast
 * (desc) Proxies a request to the Python forecasting microservice.
 * (query) lat - The latitude of the location.
 * (query) lon - The longitude of the location.
 */

export const getForecast = async (req: Request, res: Response) => {
    if (!FORECAST_SERVICE_URL) {
        res.status(500).json({ error: 'Forecast service URL is not configured.' });
        return;
    }

    const { lat, lon } = req.query;
    if (!lat || !lon) {
        res.status(400).json({ error: 'Latitude and longitude are required.' });
        return;
    }

    console.log(`Forwarding request to Python service for lat: ${lat}, lon: ${lon}`);

    try {
        const forecastResponse = await axios.get(FORECAST_SERVICE_URL, {
            params: { lat, lon },
            timeout: 30000 // 30 second timeout for the model to run
        });

        res.json(forecastResponse.data);

    } catch (error: any) {
        console.error('Error contacting Python forecasting service:', error.message);
        if (error.code === 'ECONNREFUSED') {
            res.status(503).json({ error: 'Forecasting service is currently unavailable.' });
            return;
        }
        res.status(500).json({ error: 'An error occurred while generating the forecast.' });
    }
}