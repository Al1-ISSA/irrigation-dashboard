import { NextResponse } from "next/server";
import { z } from "zod";
import axios from "axios";

const CitySchema = z.object({
  city: z.string(),
});

type CityData = z.infer<typeof CitySchema>;

export async function POST(request: Request) {
  try {
    const body: CityData = await request.json();
    CitySchema.parse(body);
    const { city } = body;

    const url = `http://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHER_API_KEY}&q=${city}&days=1`;

    const res = await axios.get(url);

    const weatherData = await res.data;

    //current weather
    const { temp_c, humidity, wind_kph, pressure_in, uv, cloud } =
      weatherData.current;

    const currentConditions = {
      temp_c: temp_c,
      humidity: humidity,
      wind_kph: wind_kph,
      pressure_in: pressure_in,
      uv: uv,
      cloud: cloud,
    };

    //hourly forecast
    const hourlyForecasts: any[] = [];
    const forecastDay = weatherData.forecast.forecastday[0];

    const { localtime_epoch } = weatherData.location;

    const currentTime = localtime_epoch;

    forecastDay.hour.forEach((hour: any) => {
      const futureDate = hour.time_epoch;
      if (futureDate > currentTime) {
        const hourlyForecast = {
          time: hour.time,
          temp: hour.temp_c,
          wind: hour.wind_kph,
          humidity: hour.humidity,
          cloud: hour.cloud,
          uv: hour.uv,
        };

        hourlyForecasts.push(hourlyForecast);
      }
    });

    return NextResponse.json({
      currentConditions,
      hourlyForecasts,
    });
  } catch (error) {
    console.error("Error handling request: ", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
