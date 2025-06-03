
require('dotenv').config(); // Load .env at the top
const connectDB = require('./config/db');
connectDB();

const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, getRoomUsers, userLeave } = require('./utils/users');
const Message = require('./models/message');

const app = express();
const server = http.createServer(app);
const io = socketio(server);



const PORT = process.env.PORT || 3000;
const botName = 'ChatBot';

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Socket.IO connection
io.on('connection', (socket) => {
    console.log('🔌 New WebSocket connection established');

    socket.on('joinRoom', async ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        // ✅ Fetch and send old messages from MongoDB
        try {
            const oldMessages = await Message.find({ room: user.room }).sort({ createdAt: 1 });
            oldMessages.forEach(message => socket.emit('message', message));
        } catch (err) {
            console.error('❌ Failed to fetch old messages:', err);
        }

        // Welcome message
        socket.emit('message', formatMessage(botName, `Welcome to the room ${user.room}, ${user.username}!`));

        // Notify others in room
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the room!`));

        // Send room and user info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    // Listen for new messages
    socket.on('message', async (msg) => {
        const user = getCurrentUser(socket.id);
        const formattedMsg = formatMessage(user.username, msg);

        try {
            await new Message({
                username: formattedMsg.username,
                room: user.room,
                text: formattedMsg.text,
                time: formattedMsg.time
            }).save();

            console.log('💾 Message saved to DB');
        } catch (err) {
            console.error('❌ Failed to save message:', err);
        }

        io.to(user.room).emit('message', formattedMsg);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if (user) {
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the room`));
        }
        console.log('❌ User has disconnected');
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
