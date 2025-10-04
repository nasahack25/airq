import { Request, Response } from "express";
import { GEMINI_API_KEY } from "../config";

export const handleChat = async (req: Request, res: Response) => {
    const { message, forecastData, user } = req.body;

    if (!message || !forecastData || !user) {
        return res.status(400).json({ error: "Missing message, forecast data, or user information." });
    }

    if (!GEMINI_API_KEY) {
        return res.status(500).json({ error: "Gemini API key is not configured on the server." });
    }

    // --- PROMPT ENGINEERING: The Secret to a Smart AI ---
    // 1. Define the AI's persona and rules.
    const systemPrompt = `You are Airi, a friendly and knowledgeable environmental health assistant for the AirQ platform. Your goal is to help users understand air quality and make healthy, personalized decisions.
    - Your answers must be concise, helpful, and easy to understand for a non-expert.
    - Always use the real-time data provided below to form your answer. Do not use generic knowledge if specific data is available.
    - The user's name is ${user.username}. Address them by their name when it feels natural.
    - If the user asks about health, and their profile indicates a condition (like asthma), be extra cautious and empathetic in your advice.
    `;

    // 2. Combine the system prompt, live data, and the user's question.
    const fullPrompt = `
    ${systemPrompt}

    --- REAL-TIME DATA FOR USER'S LOCATION ---
    ${JSON.stringify(forecastData, null, 2)}
    --- END OF REAL-TIME DATA ---

    Now, please answer the following question from ${user.username}: "${message}"
    `;

    try {
        // const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GEMINI_API_KEY || 'MISSING_KEY'}`;

        const payload = {
            contents: [{
                parts: [{ text: fullPrompt }]
            }]
        };

        const apiResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!apiResponse.ok) {
            throw new Error(`Gemini API responded with status: ${apiResponse.status}`);
        }

        const responseData = await apiResponse.json();
        const botResponse = responseData.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!botResponse) {
            throw new Error("Failed to extract a response from the Gemini API.");
        }

        res.json({ reply: botResponse });

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        res.status(500).json({ error: "I'm sorry, I'm having trouble connecting to my brain right now. Please try again in a moment." });
    }
};
