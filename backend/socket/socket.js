const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const { DB } = require("../src/config/mysqlDB");

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:3000'],
        methods: ['GET', 'POST'],
    },
});

const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
}

const userSocketMap = {}; // {userId->socketId}


io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId
    if (userId !== undefined) {
        userSocketMap[userId] = socket.id;
    }

    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    // Listen for typing events
    socket.on('typing', (data) => {
        const receiverSocketId = getReceiverSocketId(data.receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('userTyping', { senderId: userId });
        }
    });

    // Listen for stop typing events
    socket.on('stopTyping', (data) => {
        const receiverSocketId = getReceiverSocketId(data.receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('userStopTyping', { senderId: userId });
        }
    });

    socket.on('startReading', async ({ senderId, receiverId }) => {
        try {
            await DB.messageModel.update(
                { is_read: true },
                {
                    where: {
                        sender_id: senderId,
                        receiver_id: receiverId,
                        is_read: false,
                    },
                }
            );
            
            // Notify sender that messages have been read
            const senderSocketId = getReceiverSocketId(senderId);
            if (senderSocketId) {
                io.to(senderSocketId).emit('messagesRead', { senderId, receiverId });
            }
        } catch (error) {
            console.error('Error marking messages as read:', error);
        }
    });

    socket.on('disconnect', () => {
        delete userSocketMap[userId];
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    })
})

module.exports = { app, io, server, getReceiverSocketId };

