import { WebSocketServer } from "ws";
import * as mqtt from "mqtt";
// Create a new WebSocket server listening on port 8080 with specific configurations
const wss = new WebSocketServer({
    port: 8080,
    perMessageDeflate: {
        zlibDeflateOptions: {
            chunkSize: 1024,
            memLevel: 7,
            level: 3,
        },
        zlibInflateOptions: {
            chunkSize: 10 * 1024,
        },
        clientNoContextTakeover: true,
        serverNoContextTakeover: true,
        serverMaxWindowBits: 10,
        concurrencyLimit: 10,
        threshold: 1024,
    },
});
// Connect to the Mosquitto test MQTT broker using WebSocket protocol
const mqttClient = mqtt.connect("ws://test.mosquitto.org:8080/mqtt");
mqttClient.on("connect", () => {
    mqttClient.subscribe("/UA/UNI/IOT");
});
// Handle incoming MQTT messages
mqttClient.on("message", (topic, message) => {
    console.log(`Received message on topic ${topic}: ${message.toString()}`);
    // Broadcast the message to all connected WebSocket clients
    wss.clients.forEach((client) => {
        if (client.readyState === client.OPEN) {
            client.send(`${message.toString()}`);
        }
    });
});
// Set up WebSocket connection handling separately
wss.on("connection", (ws) => {
    console.log("New WebSocket connection");
    ws.on("message", function message(data) {
        console.log("Received message from WebSocket client: %s", data);
    });
});
console.log("WebSocket server started on ws://localhost:8080");
