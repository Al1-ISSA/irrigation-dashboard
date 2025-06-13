"use client";
import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import LiveCard from "@/components/LiveCard";

interface Data {
  soil: number;
  light: number;
  temp: number;
  humidity: number;
  motion: number;
  armed: boolean;
  // buzzer: number;
  time: string;
  automated: boolean;
  shade: string;
}

export default function Live() {
  const [messages, setMessages] = useState<string[]>([]);
  const [data, setData] = useState<Data | null>(null);
  const ws = useRef<WebSocket | null>(null);
  useEffect(() => {
    // Function to initialize the WebSocket connection
    function connect() {
      ws.current = new WebSocket("ws://localhost:8080");

      ws.current.onopen = () => {
        console.log("WebSocket Connected");
      };

      ws.current.onmessage = (event: MessageEvent) => {
        console.log("data", event.data);
        const message = JSON.parse(event.data);
        setData(message);
        setMessages((prevMessages) => [...prevMessages, event.data]);
      };

      ws.current.onclose = (event) => {
        if (!event.wasClean) {
          console.log("WebSocket disconnected. Reconnecting...");
        }
        setTimeout(connect, 3000); // Attempt to reconnect every 3 seconds
      };

      ws.current.onerror = (error: Event) => {
        console.error("WebSocket error:", error);
        ws.current?.close();
      };
    }

    connect(); // Initial connection

    return () => {
      ws.current?.close();
    };
  }, []);

  // useEffect(() => {
  //   if (data?.buzzer === 1) {
  //     alert('Motion has been detected');
  //   }
  // }, [data?.buzzer]);
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Live Values</h1>
      </div>
      <div className="grid grid-cols-2 justify-items-center gap-4">
        {data && (
          <>
            <LiveCard
              title="Soil Moisture"
              value={data.soil.toString()}
              unit="%"
            />
            <LiveCard
              title="Light Intensity"
              value={data.light.toString()}
              unit="lux"
            />
            <LiveCard
              title="Temperature"
              value={data.temp.toString()}
              unit="°C"
            />
            <LiveCard
              title="Humidity"
              value={data.humidity.toString()}
              unit="%"
            />
            <LiveCard
              title="Alarm State"
              value={data.armed ? "Armed" : "Disarmed"}
            />
            <LiveCard
              title="Automation State"
              value={data.automated ? "Automated" : "Manual"}
            />
            <LiveCard
              title="Shade State"
              value={data.shade}

            />
          </>
        )}
      </div>
    </>
  );
}
