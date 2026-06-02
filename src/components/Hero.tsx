import type { DailySummary, Region, WeatherSnapshot } from "../types";
import { formatDateSl } from "../lib/date";
import { describeWeatherCode, weatherEmoji } from "../lib/weatherDescriptions";

type Props = {
  region: Region;
  weather: WeatherSnapshot | null;
  weatherError: string | null;
  summary: DailySummary;
};

function gardenWeatherTip(today: WeatherSnapshot["today"] | undefined): string {
  if (!today) return "Ko se vreme naloži, preveri predvsem vlago zemlje.";
  if ((today.precipitationSum ?? 0) >= 5 || (today.precipitationProbabilityMax ?? 0) >= 70) {
    return "Zalivanje večinoma preskoči in raje preveri odtekanje vode.";
  }
  if ((today.maxTemperature ?? 0) >= 30) {
    return "Zalivaj zgodaj zjutraj ali zvečer, čez dan pa rastlin ne obremenjuj.";
  }
  if ((today.minTemperature ?? 10) <= 2) {
    return "Občutljive sadike zaščiti ali prestavi presajanje.";
  }
  if ((today.windSpeedMax ?? 0) >= 35) {
    return "Preveri opore in lažje lonce, občutljiva opravila raje prestavi.";
  }
  return "Dober dan za kratek pregled zemlje, listov in najnujnejših opravil.";
}

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
          Vremenski podatki: Open-Meteo za {region.weatherName}. Priporočila so informativna.
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
                <span>{today?.precipitationProbabilityMax ?? "–"}% dež · {today?.precipitationSum ?? "–"} mm</span>
                <span>{today?.windSpeedMax ?? "–"} km/h veter</span>
              </div>
              <p className="weather-tip">{gardenWeatherTip(today)}</p>
            </>
          )}
        </div>
      </aside>
    </header>
  );
}
