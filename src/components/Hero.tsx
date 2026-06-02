import type { Region, WeatherSnapshot } from "../types";
import { formatDateSl } from "../lib/date";
import { describeWeatherCode, weatherEmoji } from "../lib/weatherDescriptions";

type Props = {
  region: Region;
  weather: WeatherSnapshot | null;
  weatherError: string | null;
};

export function Hero({ region, weather, weatherError }: Props) {
  const today = weather?.today;
  return (
    <header className="hero">
      <div className="hero-copy">
        <p className="eyebrow">Moj vrt</p>
        <h1>Kaj danes na vrtu?</h1>
        <p className="hero-text">
          Dnevni vrtnarski dashboard za začetnike: združi mesečni koledar, tvoje rastline, tip vrta in javno vremensko napoved.
        </p>
        <div className="source-note">
          Vreme: Open-Meteo, lokacija za regijo: {region.weatherName}. Nasveti so informativni in jih prilagodi svoji mikroklimi.
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
