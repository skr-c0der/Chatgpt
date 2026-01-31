//Thread One chat conversation model
import mongoose from "mongoose";

//Message Schema   
const MessageSchema = new mongoose.Schema({
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
}); 

//Schema for a chat thread
const ThreadSchema = new mongoose.Schema({
    threadId:{ type: String, required: true,unique: true},  //Unique identifier for the thread
    title: { type: String, default: "New Chat" },
    messages: [MessageSchema],  //Array of messages in the thread
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Thread = mongoose.model("Thread", ThreadSchema);

export default Thread;      