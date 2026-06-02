import type { Region, WeatherSnapshot } from "../types";
import { buildWeatherRecommendationsForDay } from "../lib/recommendations";
import { formatDateSl } from "../lib/date";
import { describeWeatherCode, weatherEmoji } from "../lib/weatherDescriptions";

type Props = {
  weather: WeatherSnapshot | null;
  region: Region;
};

export function ForecastStrip({ weather, region }: Props) {
  if (!weather) {
    return (
      <section className="panel">
        <div className="empty-state">Vremenska napoved se nalaga.</div>
      </section>
    );
  }

  return (
    <section className="panel">
      <div className="panel-heading">
        <p className="eyebrow">7 dni</p>
        <h2>Kaj se splača delati naslednje dni?</h2>
        <p>Vremenski pregled za zalivanje, presajanje, zaščito pred slano, veter in mokre dni. Podatki: Open-Meteo za {region.weatherName}.</p>
      </div>
      <div className="forecast-grid">
        {weather.days.map((day) => {
          const dailyAdvice = buildWeatherRecommendationsForDay(day, region, `day-${day.date}`);
          return (
            <article key={day.date} className="forecast-day">
              <div className="forecast-date">{formatDateSl(day.date)}</div>
              <div className="forecast-icon">{weatherEmoji(day.weatherCode)}</div>
              <strong>{describeWeatherCode(day.weatherCode)}</strong>
              <span>{day.minTemperature ?? "–"}–{day.maxTemperature ?? "–"} °C</span>
              <span>{day.precipitationProbabilityMax ?? "–"}% dež · {day.precipitationSum ?? "–"} mm</span>
              <span>{day.windSpeedMax ?? "–"} km/h veter</span>
              <ul className="forecast-advice">
                {dailyAdvice.slice(0, 2).map((advice) => (
                  <li key={advice.id}>{advice.title}</li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </section>
  );
}
