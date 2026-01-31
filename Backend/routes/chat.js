//Routes 
import express from 'express';
import Thread from '../models/Thread.js';
import { getOpenAIResponse } from '../utils/openai.js';

const router = express.Router();

//POST request to check test router
router.post('/test', async (req, res) => {
    try {
        const thread = new Thread({
            threadId: "test123",
            title: "Test Thread",
            messages: []
        });
        const result = await thread.save();
        res.send(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Test route failed",
            error: error.message
        })
    }
})
//Get all threads
router.get("/thread", async (req, res) => {
    try {
        const threads = await Thread.find({}).sort({ updatedAt: -1 });
        //descending order of updatedAt...most recent data on top
        res.json(threads);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch threads" });
    }
});
//Get a specific thread by ID
router.get("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;

    try {
        const thread = await Thread.findOne({ threadId }); //find thread by threadId

        if (!thread) {
            res.status(404).json({ error: "Thread not found" });
        }

        res.json(thread.messages); //return only messages array to see on frontend
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch chat" });
    }
});
//Delete a specific thread by ID chat
router.delete("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;

    try {
        const deletedThread = await Thread.findOneAndDelete({ threadId });

        if (!deletedThread) { //if thread to be deleted not found
            res.status(404).json({ error: "Thread not found" });
        }

        res.status(200).json({ success: "Thread deleted successfully" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to delete thread" });
    }
});
//Create a new thread Frontend will call this when user clicks on New Chat
router.post("/chat", async (req, res) => {
    const { threadId, message } = req.body; //threadId and message from frontend

    //Validate input
    if (!threadId || !message) {
        res.status(400).json({ error: "missing required fields" });
    }

    try {
        //if thread with threadId exists, fetch it else create a new one
        let thread = await Thread.findOne({ threadId });

        if (!thread) {
            //create a new thread in Db
            thread = new Thread({
                threadId,
                title: message, //first message as title like GPT
                messages: [{ role: "user", content: message }]
            });
        } else {
            thread.messages.push({ role: "user", content: message }); //add user message to messages array
        }
        //Function to get response from OpenAI API
        const assistantReply = await getOpenAIResponse(message);

        thread.messages.push({ role: "assistant", content: assistantReply });
        thread.updatedAt = new Date();   //update the updatedAt field

        await thread.save();
        res.json({ reply: assistantReply });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "something went wrong" });
    }
});
export default router;