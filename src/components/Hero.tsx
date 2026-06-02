import type { DailySummary, Region, WeatherSnapshot } from "../types";
import { formatDateSl } from "../lib/date";
import { describeWeatherCode, weatherEmoji } from "../lib/weatherDescriptions";

type Props = {
  region: Region;
  weather: WeatherSnapshot | null;
  weatherError: string | null;
  summary: DailySummary;
};

export function Hero({ region, weather, weatherError, summary }: Props) {
  const today = weather?.today;
  return (
    <header className={`hero ${summary.tone}`}>
      <div className="hero-copy">
        <p className="eyebrow">Moj vrt</p>
        <h1>Kaj danes na vrtu?</h1>
        <div className="daily-summary">
          <strong>{summary.title}</strong>
          <p>{summary.body}</p>
        </div>
        <div className="source-note">
          Vreme: Open-Meteo Forecast API, referenčna lokacija {region.weatherName}. Nasveti so informativni in niso strokovno jamstvo.
        </div>
      </div>

      <aside className="weather-card" aria-label="Današnje vreme">
        <div className="weather-icon">{weatherEmoji(today?.weatherCode)}</div>
        <div>
          <p className="eyebrow">Danes</p>
          <h2>{today ? formatDateSl(today.date) : "nalagam vreme"}</h2>
          {weatherError ? (
            <p className="warning-text">{weatherError}</p>
          ) : (
            <>
              <p className="weather-summary">{describeWeatherCode(today?.weatherCode)}</p>
              <div className="weather-metrics">
                <span>{today?.minTemperature ?? "–"}–{today?.maxTemperature ?? "–"} °C</span>
                <span>{today?.precipitationProbabilityMax ?? "–"}% dež</span>
                <span>{today?.windSpeedMax ?? "–"} km/h veter</span>
              </div>
            </>
          )}
        </div>
      </aside>
    </header>
  );
}
