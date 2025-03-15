const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: process.env.PORT || 3000 });

wss.on("connection", (ws) => {
    console.log("✅ Новый игрок подключен");

    ws.on("message", (message) => {
        console.log("📩 Сообщение от клиента:", message);
        ws.send("Принято: " + message);
    });

    ws.on("close", () => {
        console.log("❌ Игрок отключен");
    });
});

console.log("🚀 Сервер запущен!");
