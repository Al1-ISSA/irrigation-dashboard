// app/api/register/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import * as mqtt from "mqtt"; // Import MQTT client

// Define the schema for the request payload
const PumpSchema = z.object({
  pump: z.enum(["on", "off"]),
  volume: z.number().int().positive(),
});

// Type for the parsed request data
type PumpData = z.infer<typeof PumpSchema>;

export async function POST(request: Request) {
  try {
    // Parse and validate the incoming request data using Zod
    const body: PumpData = await request.json();
    PumpSchema.parse(body);

    // Connect to the MQTT broker
    const client = mqtt.connect("mqtt://test.mosquitto.org:1883");

    client.on("connect", function () {
      // Once connected, publish the message
      client.publish("/UA/UNI/PUMP", JSON.stringify(body), {}, function () {
        client.end(); // Close the connection after publishing
      });
    });

    return NextResponse.json({ status: "Message sent", code: 200 });
  } catch (error) {
    console.error("Error handling request: ", error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    // Handle other unexpected errors
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
