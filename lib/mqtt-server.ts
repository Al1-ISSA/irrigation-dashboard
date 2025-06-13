// mqtt-server.ts
import mqtt from "mqtt";
import { PrismaClient } from "@prisma/client";
import PQueue from "p-queue";
import axios from "axios";

const prisma = new PrismaClient();
const brokerUrl = "mqtt://test.mosquitto.org:1883";
const topic = "/UA/UNI/IOT";

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
  try {
    const content = JSON.parse(message.toString());

    if (content.automated === true) {
      console.log("Automating irrigation and light control");
      calculateIrrigation(content.soil, content.humidity, content.temp);
      checkNeedForLight(content.light);
    }

    queue.add(async () => {
      try {
        if (content.soil !== undefined) {
          await prisma.soil.create({
            data: {
              topic,
              value: content.soil,
            },
          });
        }

        if (content.light !== undefined) {
          await prisma.light.create({
            data: {
              topic,
              value: content.light,
            },
          });
        }

        if (content.temp !== undefined) {
          await prisma.temperature.create({
            data: {
              topic,
              value: content.temp,
            },
          });
        }

        if (content.humidity !== undefined) {
          await prisma.humidity.create({
            data: {
              topic,
              value: content.humidity,
            },
          });
        }

        console.log("Message saved to database");
      } catch (err) {
        console.error("Error saving message to database:", err);
      }
    });
  } catch (err) {
    console.error("Error parsing message:", err);
  }
});

interface WeatherForecast {
  temp: number;
  wind: number;
  humidity: number;
  cloud: number;
  uv: number;
}

interface CurrentConditions {
  temp_c: number;
  humidity: number;
  wind_kph: number;
  pressure_in: number;
  uv: number;
  cloud: number;
}

interface WeatherData {
  currentConditions: CurrentConditions;
  hourlyForecasts: WeatherForecast[];
}

const calculateIrrigation = async (
  soilMoisture: number,
  humidity: number,
  temperature: number
) => {
  const url = `http://localhost:3000/api/weather`;
  const res = await axios.post(url, { city: "Beirut" });

  const weatherData: WeatherData = await res.data;

  // Define thresholds
  const moistureThresholds = { dry: 300, humid: 700 };
  let needWater = false;
  let volume = 0;

  // Check soil moisture
  if (soilMoisture < moistureThresholds.dry) {
    needWater = true;
    volume = 10; // Base volume in liters
  } else if (
    soilMoisture >= moistureThresholds.dry &&
    soilMoisture < moistureThresholds.humid
  ) {
    needWater = true;
    volume = 5; // Reduced volume in liters
  }

  // Adjust irrigation based on the forecast
  for (const forecast of weatherData.hourlyForecasts) {
    if (forecast.humidity > 75 && forecast.cloud > 60) {
      volume -= 2; // Reduce water volume as high humidity and cloudiness may imply rain
    }
  }

  // Ensure volume does not go negative
  volume = Math.max(volume, 0);

  // Decide not to irrigate if upcoming conditions suggest significant rain
  if (
    volume === 0 ||
    weatherData.hourlyForecasts.some((f) => f.temp < 18 && f.cloud > 70)
  ) {
    needWater = false;
  } else {
    const pumpUrl = `http://localhost:3000/api/pump`;
    await axios.post(pumpUrl, { pump: "on", volume });
  }
};

const checkNeedForLight = async (currentLightLevel: number) => {
  const lightThreshold = 600; // Threshold value for light level below which plants need artificial light
  let needLight = "off";
  let shadeState = "open";
  if (currentLightLevel < lightThreshold) {
    needLight = "on";
    shadeState = "open";
  } else {
    // Even if the light is currently low, if the cloud cover is not too high, sunlight might be sufficient soon
    needLight = "off";
    shadeState = "close";
  }

  const lightUrl = `http://localhost:3000/api/light`;
  await axios.post(lightUrl, { light: needLight });

  const motionRequest = axios.post("http://localhost:3000/api/shade", {
    shade: shadeState,
  });
};
