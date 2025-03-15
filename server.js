const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Разрешаем любые подключения (для тестов)
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log(`✅ Клиент подключен: ${socket.id}`);

    socket.emit("serverMessage", "Добро пожаловать!");

    socket.on('clientMessage', (data) => {
        console.log(`📩 Сообщение от клиента: ${data}`);
        socket.emit('serverMessage', `Принято: ${data}`);
    });

    socket.on('disconnect', () => {
        console.log(`❌ Клиент отключен: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
});
