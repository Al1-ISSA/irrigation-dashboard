// mqtt-server.ts
import mqtt from "mqtt";
import { PrismaClient } from "@prisma/client";
import PQueue from "p-queue";
const prisma = new PrismaClient();
const brokerUrl = "mqtt://test.mosquitto.org:1883";
const topic = "/UA/UNI/SOIL";
const queue = new PQueue({ concurrency: 1 });
const client = mqtt.connect(brokerUrl);
client.on("connect", () => {
    client.subscribe(topic, (err) => {
        if (err) {
            console.error(`Error subscribing to topic ${topic}:`, err);
        }
    });
});
client.on("message", async (topic, message) => {
    const content = message.toString();
    queue.add(async () => {
        try {
            await prisma.message.create({
                data: {
                    topic,
                    content,
                },
            });
            console.log("Message saved to database");
        }
        catch (err) {
            console.error("Error saving message to database:", err);
        }
    });
});
