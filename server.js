const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let userCount = 0;

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket => {
    userCount++;
    io.emit('user-count', userCount);

    socket.on('new-user', name => {
        socket.username = name;
    });

    socket.on('send-chat-message', message => {
        io.emit('chat-message', { name: socket.username, message });
    });

    socket.on('disconnect', () => {
        userCount--;
        io.emit('user-count', userCount);
    });
});

app.get('/', (req, res) => {
    res.redirect('/login.html');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));