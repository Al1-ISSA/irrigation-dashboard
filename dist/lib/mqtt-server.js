// mqtt-server.ts
import mqtt from 'mqtt';
import { PrismaClient } from '@prisma/client';
import PQueue from 'p-queue';
const prisma = new PrismaClient();
const brokerUrl = 'mqtt://test.mosquitto.org:1883';
const topic = 'UA/UNI';
const queue = new PQueue({ concurrency: 1 });
const client = mqtt.connect(brokerUrl);
client.on('connect', () => {
    console.log(`Connected to MQTT broker at ${brokerUrl}`);
    client.subscribe(topic, (err) => {
        if (err) {
            console.error(`Error subscribing to topic ${topic}:`, err);
        }
        else {
            console.log(`Subscribed to topic ${topic}`);
        }
    });
});
client.on('message', async (topic, message) => {
    const content = message.toString();
    console.log(`Received message from topic ${topic}:`, content);
    queue.add(async () => {
        try {
            await prisma.message.create({
                data: {
                    topic,
                    content,
                },
            });
            console.log('Message saved to database');
        }
        catch (err) {
            console.error('Error saving message to database:', err);
        }
    });
});
