const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');

// Save chat (append to existing or create new)
router.post('/save', async (req, res) => {
  try {
    const { userId, messages } = req.body;

    if (!userId || !Array.isArray(messages)) {
      return res.status(400).json({ success: false, message: 'Invalid data' });
    }

    // Push messages into existing chat document, or create if not found
    await Chat.findOneAndUpdate(
      { user: userId },
      { $push: { messages: { $each: messages } } },
      { upsert: true, new: true }
    );

    res.status(201).json({ success: true, message: 'Chat saved successfully' });
  } catch (error) {
    console.error('Error saving chat:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Fetch full chat history for a user
router.get('/history', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    const chat = await Chat.findOne({ user: userId });

    res.status(200).json({ success: true, chats: chat?.messages || [] });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

