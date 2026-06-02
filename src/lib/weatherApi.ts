import type { Region } from "../types";
import type { WeatherSnapshot } from "../types";

function asNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

export async function fetchWeather(region: Region): Promise<WeatherSnapshot> {
  const params = new URLSearchParams({
    latitude: String(region.latitude),
    longitude: String(region.longitude),
    timezone: "Europe/Ljubljana",
    forecast_days: "7",
    current: "temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m",
    daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max"
  });

  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Open-Meteo napaka: ${response.status}`);
  }

  const data = await response.json();
  const times: string[] = data.daily?.time ?? [];
  const days = times.map((date, index) => ({
    date,
    weatherCode: asNumber(data.daily?.weather_code?.[index]),
    minTemperature: asNumber(data.daily?.temperature_2m_min?.[index]),
    maxTemperature: asNumber(data.daily?.temperature_2m_max?.[index]),
    precipitationSum: asNumber(data.daily?.precipitation_sum?.[index]),
    precipitationProbabilityMax: asNumber(data.daily?.precipitation_probability_max?.[index]),
    windSpeedMax: asNumber(data.daily?.wind_speed_10m_max?.[index])
  }));

  return {
    locationName: region.weatherName,
    fetchedAt: new Date().toISOString(),
    currentTemperature: asNumber(data.current?.temperature_2m),
    currentHumidity: asNumber(data.current?.relative_humidity_2m),
    currentPrecipitation: asNumber(data.current?.precipitation),
    currentWindSpeed: asNumber(data.current?.wind_speed_10m),
    currentWeatherCode: asNumber(data.current?.weather_code),
    today: days[0],
    days
  };
}
