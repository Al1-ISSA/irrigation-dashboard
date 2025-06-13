import axios from "axios";
const calculateIrrigation = async (soilMoisture, humidity, temperature) => {
    const url = `localhost:3000/api/weather`;
    const res = await axios.post(url, { city: "Beirut" });
    const weatherData = await res.data;
    // Define thresholds
    const moistureThresholds = { dry: 300, humid: 700 };
    let needWater = false;
    let volume = 0;
    // Check soil moisture
    if (soilMoisture < moistureThresholds.dry) {
        needWater = true;
        volume = 10; // Base volume in liters
    }
    else if (soilMoisture >= moistureThresholds.dry &&
        soilMoisture < moistureThresholds.humid) {
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
    if (volume === 0 ||
        weatherData.hourlyForecasts.some((f) => f.temp < 18 && f.cloud > 70)) {
        needWater = false;
    }
    else {
        const pumpUrl = `localhost:3000/api/pump`;
        await axios.post(pumpUrl, { pump: "on", volume });
    }
};
const checkNeedForLight = async (currentLightLevel) => {
    const url = `localhost:3000/api/weather`;
    const res = await axios.post(url, { city: "Beirut" });
    const weatherData = await res.data;
    const lightThreshold = 300; // Threshold value for light level below which plants need artificial light
    let needLight = "off";
    // Check current light level
    if (currentLightLevel < lightThreshold) {
        needLight = "on";
        // Check if the cloud cover is too high in the next hours, which might suggest poor sunlight
        const highCloudCover = weatherData.hourlyForecasts.some((forecast) => forecast.cloud > 70);
        if (highCloudCover) {
            needLight = "on";
        }
        else {
            // Even if the light is currently low, if the cloud cover is not too high, sunlight might be sufficient soon
            needLight = "off";
        }
    }
    const lightUrl = `localhost:3000/api/light`;
    await axios.post(lightUrl, { light: needLight });
};
export { calculateIrrigation, checkNeedForLight };
