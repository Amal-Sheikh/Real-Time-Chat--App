const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://127.0.0.1:3000", // Allow requests from this origin
        methods: ["GET", "POST"]
    }
});

const users = {};
// agar ksisi user nai join kiya toh sbko bta ado new user joined
io.on('connection', (socket) => {
    console.log("A user connected:", socket.id);

    socket.on('new-user-joined', (name) => {
        console.log("New user:", name);

        // This associates the connected socket's ID (a unique identifier for the connection) with the user's
        //  name in the users object.
        //  This way, you can refer to users based on their socket connections
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });
    
    // ksisi nai msg emit kiya hai toh sbko display krwaa do
    socket.on('send', (message) => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });
    // This sends the received message to all connected clients (except the sender). It emits a receive event with
    //  an object containing both the message text and 
    // the sender's name (retrieved from the users object using the socket's ID).

    socket.on('disconnect', () => {
        console.log("User disconnected:", users[socket.id]);
        socket.broadcast.emit('user-left', users[socket.id]);
        delete users[socket.id];
    });
});

server.listen(8000, () => {
    console.log('Server is running on port 8000');
});
