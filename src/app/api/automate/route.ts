// app/api/register/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import * as mqtt from "mqtt"; // Import MQTT client

// Define the schema for the request payload
const LightSchema = z.object({
  automate: z.enum(["on", "off"]),
});

// Type for the parsed request data
type LightData = z.infer<typeof LightSchema>;

export async function POST(request: Request) {
  try {
    // Parse and validate the incoming request data using Zod
    const body: LightData = await request.json();
    LightSchema.parse(body);

    // Connect to the MQTT broker
    const client = mqtt.connect("mqtt://test.mosquitto.org:1883");

    client.on("connect", function () {
      client.publish("/UA/UNI/AUTOMATE", JSON.stringify(body), {}, function () {
        client.end();
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
