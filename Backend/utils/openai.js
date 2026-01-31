import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const getOpenAIResponse = async (message) => {
    try {
        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: message }],
            model: "gpt-3.5-turbo",
        });
        return completion.choices[0].message.content;
    } catch (error) {
        console.error("Error generating OpenAI response:", error);
        // Return a fallback message if API fails, to prevent crashing the chat flow completely or rethrow
        // Throwing so the route handler catches it
        throw error;
    }
};
