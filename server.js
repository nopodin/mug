const WebSocket = require("ws");
const express = require("express");
const cors = require("cors");

const app = express();

// Разрешаем все источники (CORS)
app.use(cors({ origin: "*" }));

// Запускаем сервер Express
const server = app.listen(process.env.PORT || 3000, () => {
    console.log(`🚀 Сервер работает на порту ${server.address().port}`);
});

// Запускаем WebSocket
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
    console.log("✅ Новый игрок подключен!");

    ws.on("message", (message) => {
        console.log("📩 Сообщение от клиента:", message);
        ws.send("Принято: " + message);
    });

    ws.on("close", () => {
        console.log("❌ Игрок отключен");
    });
});

console.log("🚀 WebSocket сервер запущен!");
