const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
    },
});

let players = {}; // Хранение данных игроков

io.on("connection", (socket) => {
    console.log(`Player connected: ${socket.id}`);

    // Добавляем нового игрока
    players[socket.id] = {
        id: socket.id,
        x: Math.random() * 500,
        y: Math.random() * 500,
        angle: 0,
        health: 100
    };

    // Отправляем текущий список игроков новому игроку
    socket.emit("currentPlayers", players);
    socket.broadcast.emit("newPlayer", players[socket.id]);

    // Обновление позиции игрока
    socket.on("playerMove", (data) => {
        if (players[socket.id]) {
            players[socket.id].x = data.x;
            players[socket.id].y = data.y;
            players[socket.id].angle = data.angle;
            io.emit("updatePlayers", players);
        }
    });

    // Стрельба игрока
    socket.on("shoot", (data) => {
        io.emit("playerShot", { id: socket.id, x: data.x, y: data.y, angle: data.angle });
    });

    // Отключение игрока
    socket.on("disconnect", () => {
        console.log(`Player disconnected: ${socket.id}`);
        delete players[socket.id];
        io.emit("removePlayer", socket.id);
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
