const express = require("express");
const cors = require("cors");
const WebSocket = require("ws");

const app = express();

// Разрешаем WebSockets в CSP
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src 'self'; connect-src 'self' wss://mug-production.up.railway.app;");
    next();
});

// Разрешаем CORS
app.use(cors({ origin: "*" }));

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`🚀 Сервер работает на порту ${PORT}`);
});

// WebSocket сервер
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
    console.log("✅ Новый игрок подключен!");
    ws.send("🎉 Добро пожаловать!");

    ws.on("message", (message) => {
        console.log("📩 Сообщение от клиента:", message);
        ws.send("Принято: " + message);
    });

    ws.on("close", () => {
        console.log("❌ Игрок отключен");
    });
});

console.log("🚀 WebSocket сервер запущен!");
