// models/Message.js
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    username: String,
    room: String,
    text: String,
    time: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Message', MessageSchema);
