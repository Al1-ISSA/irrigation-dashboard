'use client'
import React, { useEffect, useState, useRef } from 'react';

const MQTTListener: React.FC = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        // Function to initialize the WebSocket connection
        function connect() {
            ws.current = new WebSocket('ws://localhost:8080');

            ws.current.onopen = () => {
                console.log("WebSocket Connected");
            };

            ws.current.onmessage = (event: MessageEvent) => {
                console.log("data",event.data)
                setMessages(prevMessages => [...prevMessages, event.data]);
            };

            ws.current.onclose = (event) => {
                if (!event.wasClean) {
                    console.log('WebSocket disconnected. Reconnecting...');
                }
                setTimeout(connect, 3000);  // Attempt to reconnect every 3 seconds
            };

            ws.current.onerror = (error: Event) => {
                console.error('WebSocket error:', error);
                ws.current?.close();
            };
        }

        connect();  // Initial connection

        return () => {
            ws.current?.close();
        };
    }, []);

    return (
        <div>
            <h2>MQTT Messages</h2>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>{msg}</li>  // Consider using a more unique key if possible
                ))}
            </ul>
        </div>
    );
};

export default MQTTListener;