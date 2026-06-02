import plantsEnrichedRaw from "../../moj-vrt-content-quality-pack/data/plants_enriched.json";
import seoContentPlanRaw from "../../moj-vrt-content-quality-pack/data/seo_content_plan.json";
import type { Plant, Recommendation } from "../types";
import type { BeginnerMistake } from "../lib/recommendations";

type EnrichedPlant = {
  id: string;
  name: string;
  latin: string;
  sun: string;
  soil: string;
  water: string;
  desc: string;
  source: string;
};

type SeoPlanItem = {
  url: string;
  page_type: string;
  title: string;
};

type Props = {
  plants: Plant[];
  selectedPlantIds: string[];
  problemWatch: Recommendation[];
  beginnerMistakes: BeginnerMistake[];
};

const enrichedPlants = plantsEnrichedRaw as EnrichedPlant[];
const seoPlan = seoContentPlanRaw as unknown as SeoPlanItem[];

function sourceText(sourceIds: string | string[] | undefined): string {
  if (!sourceIds) return "source_needed";
  return Array.isArray(sourceIds) ? sourceIds.join(", ") : sourceIds;
}

export function ContentQualitySections({ plants, selectedPlantIds, problemWatch, beginnerMistakes }: Props) {
  const selectedPlants = plants.filter((plant) => selectedPlantIds.includes(plant.id));
  const selectedEnriched = enrichedPlants.filter((plant) => selectedPlantIds.includes(plant.id)).slice(0, 4);
  const selectedSeo = seoPlan
    .filter((item) => selectedPlantIds.some((id) => item.url.endsWith(`/${id}`)))
    .slice(0, 6);

  if (selectedPlantIds.length === 0) return null;

  return (
    <div className="content-quality-stack">
      <section className="panel calm-panel">
        <div className="panel-heading">
          <p className="eyebrow">Spremljaj</p>
          <h2>Spremljaj pri svojih rastlinah</h2>
          <p>Problem kartice se pokažejo samo, ko se ujemajo izbrane rastline, mesec in vremenski sprožilci.</p>
        </div>
        {problemWatch.length === 0 ? (
          <div className="empty-state">Za izbrane rastline trenutno ni posebnih dodatnih problem-watch opozoril.</div>
        ) : (
          <div className="quiet-card-grid">
            {problemWatch.map((item) => (
              <article key={item.id} className="quiet-card">
                <span className="pill subtle-pill">{item.task_type}</span>
                <h3>{item.title}</h3>
                <p>{item.short_reason}</p>
                <details>
                  <summary>Zakaj?</summary>
                  <p>{item.details}</p>
                  <small>Viri: {sourceText(item.source_ids)}</small>
                </details>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="panel calm-panel">
        <div className="panel-heading">
          <p className="eyebrow">Začetniki</p>
          <h2>Pogoste napake začetnikov</h2>
          <p>Ni seznam vsega, samo nekaj najpogostejših pasti za rastline, ki jih imaš izbrane.</p>
        </div>
        {beginnerMistakes.length === 0 ? (
          <div className="empty-state">Za izbrane rastline v tem mesecu ni dodatnih začetniških napak za prikaz.</div>
        ) : (
          <div className="quiet-card-grid">
            {beginnerMistakes.map((mistake) => {
              const plant = selectedPlants.find((item) => item.id === mistake.plant_id);
              return (
                <article key={mistake.mistake_id} className="quiet-card">
                  <span className="pill subtle-pill">{plant?.slovensko_ime ?? mistake.plant_id}</span>
                  <h3>{mistake.mistake}</h3>
                  <p>{mistake.prevention}</p>
                  <details>
                    <summary>Zakaj?</summary>
                    <p>{mistake.consequence}</p>
                    <small>Viri: {mistake.source_ids}</small>
                  </details>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="panel calm-panel">
        <div className="panel-heading">
          <p className="eyebrow">Rastline</p>
          <h2>Kratke rastlinske opombe</h2>
          <p>Podrobnosti so nižje na strani, da dnevni dashboard ostane pregleden.</p>
        </div>
        <div className="quiet-card-grid">
          {selectedEnriched.map((plant) => (
            <article key={plant.id} className="quiet-card">
              <h3>{plant.name}</h3>
              <p>{plant.desc}</p>
              <details>
                <summary>Pogoji</summary>
                <p>Sonce: {plant.sun}. Tla: {plant.soil}. Voda: {plant.water}.</p>
                <small>Viri: {plant.source}</small>
              </details>
            </article>
          ))}
        </div>
      </section>

      <section className="panel calm-panel">
        <div className="panel-heading">
          <p className="eyebrow">SEO načrt</p>
          <h2>Routing pripravljen za kasneje</h2>
          <p>Strani niso implementirane kot javni članki; to je načrt za naslednjo fazo.</p>
        </div>
        <div className="route-plan">
          <code>/rastline/:slug</code>
          <code>/kdaj/:slug</code>
        </div>
        {selectedSeo.length > 0 ? (
          <ul className="route-examples">
            {selectedSeo.map((item) => (
              <li key={item.url}>{item.url} · {item.title}</li>
            ))}
          </ul>
        ) : null}
      </section>
    </div>
  );
}
