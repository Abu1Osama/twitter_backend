const WebSocket = require("ws");

const ws = new WebSocket(`ws://localhost:7870`); // Replace with your WebSocket server URL

ws.on("open", () => {
  console.log("WebSocket connection established");
  // Send a test message to the server
  ws.send("Hello, WebSocket server!");
});

ws.on("message", (message) => {
  console.log(`Received message from server: ${message}`);
  // Handle messages received from the server
});

ws.on("close", () => {
  console.log("WebSocket connection closed");
});

ws.on("error", (error) => {
  console.error("WebSocket error:", error.message);
});
