import { useEffect, useMemo, useState } from "react";
import plantsRaw from "./data/plants.json";
import tasksRaw from "./data/calendar_tasks.json";
import type { CalendarTask, Plant, WeatherSnapshot } from "./types";
import { regions, gardenTypes } from "./data/regions";
import { getCurrentMonthNumber, getMonthName } from "./lib/date";
import { fetchWeather } from "./lib/weatherApi";
import { getMonthlyTasksForSelection, getWeatherRecommendations, mergeTodayRecommendations } from "./lib/recommendations";
import { Controls } from "./components/Controls";
import { ForecastStrip } from "./components/ForecastStrip";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { PlantSummary } from "./components/PlantSummary";
import { RecommendationList } from "./components/RecommendationList";

const plants = plantsRaw as Plant[];
const tasks = tasksRaw as CalendarTask[];
const starterPlantIds = ["paradiznik", "solata", "bucke", "korenje", "bazilika", "jagode"];
const storageKey = "moj-vrt-dashboard-settings";

type SavedSettings = {
  selectedRegionId: string;
  selectedGardenTypeId: string;
  selectedMonth: number;
  selectedPlantIds: string[];
  highPriorityOnly: boolean;
};

const defaultSettings: SavedSettings = {
  selectedRegionId: "osrednja_slovenija",
  selectedGardenTypeId: "visoka_greda",
  selectedMonth: getCurrentMonthNumber(),
  selectedPlantIds: [],
  highPriorityOnly: false
};

function loadSavedSettings(): SavedSettings {
  if (typeof window === "undefined") return defaultSettings;

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return defaultSettings;
    const parsed = JSON.parse(raw) as Partial<SavedSettings>;
    return {
      selectedRegionId: parsed.selectedRegionId ?? defaultSettings.selectedRegionId,
      selectedGardenTypeId: parsed.selectedGardenTypeId ?? defaultSettings.selectedGardenTypeId,
      selectedMonth: parsed.selectedMonth ?? defaultSettings.selectedMonth,
      selectedPlantIds: Array.isArray(parsed.selectedPlantIds) ? parsed.selectedPlantIds : defaultSettings.selectedPlantIds,
      highPriorityOnly: parsed.highPriorityOnly ?? defaultSettings.highPriorityOnly
    };
  } catch {
    return defaultSettings;
  }
}

function App() {
  const savedSettings = useMemo(() => loadSavedSettings(), []);
  const [selectedRegionId, setSelectedRegionId] = useState(savedSettings.selectedRegionId);
  const [selectedGardenTypeId, setSelectedGardenTypeId] = useState(savedSettings.selectedGardenTypeId);
  const [selectedMonth, setSelectedMonth] = useState(savedSettings.selectedMonth);
  const [selectedPlantIds, setSelectedPlantIds] = useState<string[]>(savedSettings.selectedPlantIds);
  const [highPriorityOnly, setHighPriorityOnly] = useState(savedSettings.highPriorityOnly);
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  const selectedRegion = regions.find((region) => region.id === selectedRegionId) ?? regions[0];
  const selectedGardenType = gardenTypes.find((type) => type.id === selectedGardenTypeId) ?? gardenTypes[0];
  const hasSelectedPlants = selectedPlantIds.length > 0;

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify({
      selectedRegionId,
      selectedGardenTypeId,
      selectedMonth,
      selectedPlantIds,
      highPriorityOnly
    }));
  }, [highPriorityOnly, selectedGardenTypeId, selectedMonth, selectedPlantIds, selectedRegionId]);

  useEffect(() => {
    let cancelled = false;
    setWeather(null);
    setWeatherError(null);

    fetchWeather(selectedRegion)
      .then((result) => {
        if (!cancelled) setWeather(result);
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setWeatherError(error instanceof Error ? error.message : "Vremena trenutno ni mogoče naložiti.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedRegion]);

  const calendarRecommendations = useMemo(
    () => {
      const recommendations = getMonthlyTasksForSelection({
        plants,
        tasks,
        selectedPlantIds,
        gardenType: selectedGardenType,
        month: selectedMonth
      });

      return highPriorityOnly ? recommendations.filter((item) => item.priority === "visoka") : recommendations;
    },
    [highPriorityOnly, selectedGardenType, selectedMonth, selectedPlantIds]
  );

  const weatherRecommendations = useMemo(
    () => getWeatherRecommendations(weather, selectedRegion),
    [weather, selectedRegion]
  );

  const todayRecommendations = useMemo(
    () => mergeTodayRecommendations(calendarRecommendations, weatherRecommendations),
    [calendarRecommendations, weatherRecommendations]
  );

  const doRecommendations = useMemo(
    () => hasSelectedPlants ? todayRecommendations.filter((item) => item.type === "do") : [],
    [hasSelectedPlants, todayRecommendations]
  );

  const waitRecommendations = useMemo(
    () => todayRecommendations.filter((item) => item.type === "wait"),
    [todayRecommendations]
  );

  const watchRecommendations = useMemo(
    () => todayRecommendations.filter((item) => item.type === "watch" || item.type === "weather"),
    [todayRecommendations]
  );

  function togglePlant(id: string) {
    setSelectedPlantIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  }

  function selectStarterPlants() {
    setSelectedPlantIds(starterPlantIds);
  }

  return (
    <div className="app-shell">
      <Hero region={selectedRegion} weather={weather} weatherError={weatherError} />

      <main>
        <div className="layout">
          <Controls
            regions={regions}
            gardenTypes={gardenTypes}
            plants={plants}
            selectedRegionId={selectedRegionId}
            selectedGardenTypeId={selectedGardenTypeId}
            selectedMonth={selectedMonth}
            selectedPlantIds={selectedPlantIds}
            highPriorityOnly={highPriorityOnly}
            onRegionChange={setSelectedRegionId}
            onGardenTypeChange={setSelectedGardenTypeId}
            onMonthChange={setSelectedMonth}
            onPlantToggle={togglePlant}
            onSelectStarterPlants={selectStarterPlants}
            onHighPriorityOnlyChange={setHighPriorityOnly}
          />

          <div className="dashboard-column">
            {!hasSelectedPlants ? (
              <section className="onboarding-panel">
                <div>
                  <p className="eyebrow">Prvi korak</p>
                  <h2>Izberi rastline, ki jih imaš na vrtu</h2>
                  <p>
                    Dashboard začne z vremenom, prava dnevna opravila pa se prikažejo, ko izbereš rastline. Za hiter začetek uporabi paket za začetnike ali označi samo tiste, ki jih res gojiš.
                  </p>
                </div>
                <button type="button" className="primary-button" onClick={selectStarterPlants}>Začni z osnovnim izborom</button>
              </section>
            ) : null}

            <RecommendationList
              eyebrow="Danes naredi"
              title="Najbolj smiselna opravila"
              subtitle={`Priporočila za ${selectedRegion.name}, ${selectedGardenType.name.toLowerCase()} in mesec ${getMonthName(selectedMonth)}.`}
              recommendations={doRecommendations}
              emptyMessage={hasSelectedPlants ? "Za izbrane rastline danes ni varnega opravila v tej skupini. Poglej opozorila in 7-dnevni pogled." : "Izberi rastline, da se prikažejo današnja koledarska opravila."}
            />

            <RecommendationList
              eyebrow="Raje počakaj"
              title="Opravila z vremenskim tveganjem"
              subtitle="Sem pridejo opravila, ki jih mraz, veter, vročina ali dež lahko naredijo manj smiselna."
              recommendations={waitRecommendations}
              emptyMessage="Trenutno ni večjih razlogov za prestavljanje opravil zaradi vremena."
            />

            <RecommendationList
              eyebrow="Spremljaj zaradi vremena"
              title="Voda, veter, bolezni in stres"
              subtitle="Kratek vremenski opomnik za zalivanje, mokre liste, vročino in opore."
              recommendations={watchRecommendations}
              emptyMessage="Vreme ne kaže posebnih dodatnih opozoril. Vseeno preveri zemljo in mikroklimo."
            />

            <div className="two-column">
              <PlantSummary plants={plants} selectedPlantIds={selectedPlantIds} gardenType={selectedGardenType} />
              <section className="panel compact-panel">
                <div className="panel-heading">
                  <p className="eyebrow">Regija</p>
                  <h2>{selectedRegion.name}</h2>
                </div>
                <p>{selectedRegion.description}</p>
                <div className="soft-note">{selectedRegion.seasonalNote}</div>
              </section>
            </div>
          </div>
        </div>

        <ForecastStrip weather={weather} region={selectedRegion} />
      </main>

      <Footer />
    </div>
  );
}

export default App;
