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
    const { lat, lon } = req.query;

    if (!lat || !lon) {
        return res.status(400).json({ error: 'Latitude and longitude are required.' });
    }

    console.log(`Received request for forecast at lat: ${lat}, lon: ${lon}`);

    try {
        // Forward the request to the Python microservice
        const forecastResponse = await axios.get(FORECAST_SERVICE_URL, {
            params: { lat, lon },
        });

        console.log('Successfully received response from Python service.');

        // Return the response from the Python service to the client
        res.json(forecastResponse.data);

    } catch (error: any) {
        console.error('Error contacting Python forecasting service:', error.message);
        if (error.code === 'ECONNREFUSED') {
            return res.status(503).json({
                error: 'Forecasting service is currently unavailable. Please ensure the Python service is running.'
            });
        }
        res.status(500).json({ error: 'An internal error occurred while generating the forecast.' });
    }
}