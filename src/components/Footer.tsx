import { copyText } from "../lib/microcopy";

export function Footer() {
  return (
    <footer className="site-footer">
      <p>
        {copyText("source_disclaimer", "Koledar uporablja mesečne razpone. Dejanski čas opravil je odvisen od sorte, vremena, lege in stanja tal.")}
      </p>
      <p>
        {copyText("weather_attribution", "Vremenski podatki: Open-Meteo. Priporočila so informativna.")}
      </p>
    </footer>
  );
}
