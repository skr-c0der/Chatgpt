import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js"

const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();
app.use("/api", chatRoutes); // Chat routes
app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectToDatabase();
});


//Importing necessary modules
// import OpenAI from 'openai';
// import dotenv from 'dotenv';

// dotenv.config();

// const client = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY // This is the default and can be omitted
// });

// const response = await client.responses.create({
//   model: 'gpt-4o-mini',
//   instructions: 'You are a coding assistant that talks like a pirate',
//   input: 'Joke related to Computer Science',
// });

// console.log(response.output_text);

// //Test endpoint to interact with OpenAI API from frontend OpenAI docs
// app.post("/test", async (req, res) => {
//     const options = {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${process.env.OPENAI_API_KEY}` //API key from .env file
//         },
//         body: JSON.stringify({
//             model: "gpt-4o-mini",
//             messages: [{
//                 role: "user", //role can be system, user, assistant
//                 content: req.body.message //message from frontend
//             }]
//         })
//     };

//     try {
//         const response = await fetch("https://api.openai.com/v1/chat/completions", options);
//         const data = await response.json();
//         //console.log(data.choices[0].message.content); //reply
//         res.send(data.choices[0].message.content); //send reply back to frontend
//     } catch(err) {
//         console.log(err);
//     }
// });
//MongoDB connection
const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.log("Error connecting to MongoDB:", err);
    }
};
