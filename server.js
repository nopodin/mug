const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

// Храним игроков и объекты
let players = {}; // { socketId: { x, y, angle, name, ... } }
let objects = {}; // { objectId: { x, y } } // пример толкаемых объектов

io.on("connection", (socket) => {
  console.log("✅ Игрок подключился:", socket.id);

  // Игрок сообщает свое имя
  socket.on("join", (playerName) => {
    console.log("🎮 Игрок вошёл:", playerName, "ID=", socket.id);

    players[socket.id] = {
      id: socket.id,
      name: playerName,
      x: Math.random() * 5,  // Пример случайной позиции
      y: Math.random() * 5,
      angle: 0
    };

    // Шлём всем текущее состояние
    io.emit("playersUpdate", players);
    io.emit("objectsUpdate", objects);
  });

  // Получаем движение игрока
  socket.on("playerMove", (data) => {
    // data = { x, y, angle }
    if (players[socket.id]) {
      players[socket.id].x = data.x;
      players[socket.id].y = data.y;
      players[socket.id].angle = data.angle;
      // Рассылаем обновлённое состояние
      io.emit("playersUpdate", players);
    }
  });

  // Толкаемый объект
  socket.on("pushObject", (objData) => {
    // objData = { objectId, x, y }
    objects[objData.objectId] = {
      x: objData.x,
      y: objData.y
    };
    io.emit("objectsUpdate", objects);
  });

  // Игрок отключился
  socket.on("disconnect", () => {
    console.log("❌ Игрок отключен:", socket.id);
    delete players[socket.id];
    io.emit("playersUpdate", players);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("🚀 Сервер запущен на порту", PORT);
});
