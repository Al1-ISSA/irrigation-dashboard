// src/websocket-server.ts
import { WebSocketServer } from 'ws';
import * as mqtt from 'mqtt';
// Create a new WebSocket server listening on port 8080 with specific configurations
const wss = new WebSocketServer({
    port: 8080,
    perMessageDeflate: {
        zlibDeflateOptions: {
            chunkSize: 1024,
            memLevel: 7,
            level: 3
        },
        zlibInflateOptions: {
            chunkSize: 10 * 1024
        },
        clientNoContextTakeover: true,
        serverNoContextTakeover: true,
        serverMaxWindowBits: 10,
        concurrencyLimit: 10,
        threshold: 1024
    }
});
// Connect to the Mosquitto test MQTT broker using WebSocket protocol
const mqttClient = mqtt.connect('ws://test.mosquitto.org:8080/mqtt');
mqttClient.on('connect', () => {
    console.log("Connected to MQTT broker at test.mosquitto.org");
    // Subscribe to a specific topic
    mqttClient.subscribe('UA/UNI', (err, granted) => {
        if (err) {
            console.error(`Error subscribing to topic:`, err);
        }
        else if (granted && granted.length > 0) {
            console.log(`Subscribed to topic ${granted[0].topic}`);
        }
    });
});
mqttClient.on('message', (topic, message) => {
    // Broadcast the message to all connected WebSocket clients
    wss.on('connection', (ws) => {
        ws.on('message', function message(data) {
            console.log('received: %s', data);
        });
        ws.send(`Topic: ${topic}, Message: ${message.toString()}`);
    });
});
console.log('WebSocket server started on ws://localhost:8080');
