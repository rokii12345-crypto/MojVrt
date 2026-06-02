import { useEffect, useMemo, useState } from "react";
import plantsRaw from "./data/plants.json";
import tasksRaw from "./data/calendar_tasks.json";
import starterProfilesRaw from "../moj-vrt-dashboard-logic-pack/data/starter_profiles.json";
import type { CalendarTask, Plant, UserExperience, WeatherSnapshot } from "./types";
import { regions, gardenTypes } from "./data/regions";
import { getCurrentMonthNumber, getMonthName } from "./lib/date";
import { fetchWeather } from "./lib/weatherApi";
import { buildDailySummary, getBeginnerMistakesForSelection, getMonthlyTasksForSelection, getProblemWatchRecommendations, getQualityTemplateRecommendations, getWeatherRecommendations, mergeTodayRecommendations } from "./lib/recommendations";
import { copyText } from "./lib/microcopy";
import { ContentQualitySections } from "./components/ContentQualitySections";
import { Controls } from "./components/Controls";
import { ForecastStrip } from "./components/ForecastStrip";
import { Footer } from "./components/Footer";
import { GardenSummary } from "./components/GardenSummary";
import { Hero } from "./components/Hero";
import { PlantSummary } from "./components/PlantSummary";
import { RecommendationList } from "./components/RecommendationList";
import { StarterProfiles, type StarterProfile } from "./components/StarterProfiles";

const plants = plantsRaw as Plant[];
const tasks = tasksRaw as CalendarTask[];
const starterProfiles = (starterProfilesRaw as StarterProfile[])
  .sort((a, b) => a.onboarding_order - b.onboarding_order)
  .slice(0, 4);
const starterPlantIds = ["paradiznik", "solata", "bucke", "korenje", "bazilika", "jagode"];
const storageKey = "moj-vrt-dashboard-settings";

type SavedSettings = {
  selectedRegionId: string;
  selectedGardenTypeId: string;
  selectedMonth: number;
  selectedPlantIds: string[];
  highPriorityOnly: boolean;
  experience: UserExperience;
  selectedStarterProfileId?: string;
  hasSavedSettings: boolean;
};

const defaultSettings: SavedSettings = {
  selectedRegionId: "osrednja_slovenija",
  selectedGardenTypeId: "visoka_greda",
  selectedMonth: getCurrentMonthNumber(),
  selectedPlantIds: [],
  highPriorityOnly: false,
  experience: "zacetnik",
  selectedStarterProfileId: undefined,
  hasSavedSettings: false
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
      highPriorityOnly: parsed.highPriorityOnly ?? defaultSettings.highPriorityOnly,
      experience: parsed.experience ?? defaultSettings.experience,
      selectedStarterProfileId: parsed.selectedStarterProfileId,
      hasSavedSettings: true
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
  const [experience, setExperience] = useState<UserExperience>(savedSettings.experience);
  const [selectedStarterProfileId, setSelectedStarterProfileId] = useState(savedSettings.selectedStarterProfileId);
  const [hasSavedSettings, setHasSavedSettings] = useState(savedSettings.hasSavedSettings);
  const [settingsOpen, setSettingsOpen] = useState(false);
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
      highPriorityOnly,
      experience,
      selectedStarterProfileId,
      hasSavedSettings
    }));
  }, [experience, hasSavedSettings, highPriorityOnly, selectedGardenTypeId, selectedMonth, selectedPlantIds, selectedRegionId, selectedStarterProfileId]);

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
        month: selectedMonth,
        experience
      });

      const filtered = highPriorityOnly ? recommendations.filter((item) => item.priority === "visoka") : recommendations;
      return experience === "zacetnik" ? filtered.slice(0, 10) : filtered;
    },
    [experience, highPriorityOnly, selectedGardenType, selectedMonth, selectedPlantIds]
  );

  const weatherRecommendations = useMemo(
    () => getWeatherRecommendations(weather, selectedRegion, selectedGardenType, selectedMonth),
    [selectedGardenType, selectedMonth, selectedRegion, weather]
  );

  const qualityTemplateRecommendations = useMemo(
    () => getQualityTemplateRecommendations({
      plants,
      selectedPlantIds,
      gardenType: selectedGardenType,
      month: selectedMonth,
      weatherRecommendations
    }),
    [selectedGardenType, selectedMonth, selectedPlantIds, weatherRecommendations]
  );

  const problemWatchRecommendations = useMemo(
    () => getProblemWatchRecommendations({
      plants,
      selectedPlantIds,
      month: selectedMonth,
      weatherRecommendations
    }),
    [selectedMonth, selectedPlantIds, weatherRecommendations]
  );

  const beginnerMistakes = useMemo(
    () => getBeginnerMistakesForSelection({ selectedPlantIds, month: selectedMonth }),
    [selectedMonth, selectedPlantIds]
  );

  const todayRecommendations = useMemo(
    () => mergeTodayRecommendations([...qualityTemplateRecommendations, ...calendarRecommendations], weatherRecommendations),
    [calendarRecommendations, qualityTemplateRecommendations, weatherRecommendations]
  );

  function isLongRecommendation(timeNeeded?: string): boolean {
    if (!timeNeeded) return false;
    return /45|60|90|1 h|2 h|uro|več/i.test(timeNeeded);
  }

  const todayActionRecommendations = useMemo(
    () => hasSelectedPlants ? todayRecommendations.filter((item) => item.section === "today") : [],
    [hasSelectedPlants, todayRecommendations]
  );

  const doRecommendations = useMemo(
    () => todayActionRecommendations.filter((item) => !isLongRecommendation(item.time_needed) && (item.difficulty ?? 1) < 4),
    [todayActionRecommendations]
  );

  const longerTodayRecommendations = useMemo(
    () => todayActionRecommendations.filter((item) => isLongRecommendation(item.time_needed) || (item.difficulty ?? 1) >= 4),
    [todayActionRecommendations]
  );

  const waitRecommendations = useMemo(
    () => todayRecommendations.filter((item) => item.section === "wait"),
    [todayRecommendations]
  );

  const watchRecommendations = useMemo(
    () => todayRecommendations.filter((item) => item.section === "watch"),
    [todayRecommendations]
  );

  const thisWeekRecommendations = useMemo(
    () => [...longerTodayRecommendations, ...todayRecommendations.filter((item) => item.section === "this_week")].slice(0, 6),
    [longerTodayRecommendations, todayRecommendations]
  );

  const dailySummary = useMemo(
    () => buildDailySummary({
      weather,
      region: selectedRegion,
      doCount: doRecommendations.length,
      waitCount: waitRecommendations.length,
      watchCount: watchRecommendations.length,
      selectedPlantCount: selectedPlantIds.length
    }),
    [doRecommendations.length, selectedPlantIds.length, selectedRegion, waitRecommendations.length, watchRecommendations.length, weather]
  );

  function togglePlant(id: string) {
    setSelectedPlantIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  }

  function selectStarterPlants() {
    setHasSavedSettings(true);
    setSelectedPlantIds(starterPlantIds);
  }

  function normalizeProfileGardenType(type: string) {
    return type === "vrt" ? "klasicni_vrt" : type;
  }

  function selectStarterProfile(profile: StarterProfile) {
    setSelectedStarterProfileId(profile.id);
    setSelectedRegionId(profile.region_id);
    setSelectedGardenTypeId(normalizeProfileGardenType(profile.garden_type));
    setExperience(profile.experience as UserExperience);
    setSelectedPlantIds(profile.plant_ids.split(",").map((id) => id.trim()).filter(Boolean));
    setHasSavedSettings(true);
    setSettingsOpen(false);
  }

  return (
    <div className="app-shell">
      <Hero region={selectedRegion} weather={weather} weatherError={weatherError} summary={dailySummary} />

      <main>
        {!hasSavedSettings ? <StarterProfiles profiles={starterProfiles} onSelectProfile={selectStarterProfile} /> : null}

        <GardenSummary
          region={selectedRegion}
          gardenType={selectedGardenType}
          experience={experience}
          plants={plants}
          selectedPlantIds={selectedPlantIds}
          onEdit={() => setSettingsOpen((open) => !open)}
        />

        {settingsOpen ? (
          <div className="settings-grid">
            <Controls
              regions={regions}
              gardenTypes={gardenTypes}
              plants={plants}
              selectedRegionId={selectedRegionId}
              selectedGardenTypeId={selectedGardenTypeId}
              selectedMonth={selectedMonth}
              selectedPlantIds={selectedPlantIds}
              highPriorityOnly={highPriorityOnly}
              experience={experience}
              onRegionChange={(value) => {
                setSelectedRegionId(value);
                setHasSavedSettings(true);
              }}
              onGardenTypeChange={(value) => {
                setSelectedGardenTypeId(value);
                setHasSavedSettings(true);
              }}
              onMonthChange={(value) => {
                setSelectedMonth(value);
                setHasSavedSettings(true);
              }}
              onPlantToggle={(value) => {
                togglePlant(value);
                setHasSavedSettings(true);
              }}
              onSelectStarterPlants={selectStarterPlants}
              onHighPriorityOnlyChange={(value) => {
                setHighPriorityOnly(value);
                setHasSavedSettings(true);
              }}
              onExperienceChange={(value) => {
                setExperience(value);
                setHasSavedSettings(true);
              }}
            />

            <PlantSummary plants={plants} selectedPlantIds={selectedPlantIds} gardenType={selectedGardenType} />
            <section className="panel compact-panel">
              <div className="panel-heading">
                <p className="eyebrow">Vrtni kontekst</p>
                <h2>{selectedRegion.name}</h2>
              </div>
              <p>{selectedRegion.description}</p>
              <div className="soft-note">{selectedRegion.seasonalNote}</div>
            </section>
          </div>
        ) : null}

        <div className="dashboard-column">
          <RecommendationList
            eyebrow="Danes naredi"
            title="Kaj naj danes naredim?"
            subtitle={`Za ${selectedRegion.name}, ${selectedGardenType.name.toLowerCase()} in mesec ${getMonthName(selectedMonth)}. Razponi so mesečni, ne točni datumi.`}
            recommendations={doRecommendations}
            emptyMessage={hasSelectedPlants ? "Za izbrane rastline danes ni jasnega opravila v tej skupini. Poglej opozorila in 7-dnevni pogled." : copyText("empty_plants", "Izberi nekaj rastlin, da bo dashboard pokazal opravila za tvoj vrt.")}
            limit={5}
          />

          <RecommendationList
            eyebrow="Raje počakaj"
            title="Opravila z vremenskim tveganjem"
            subtitle="Sem pridejo opravila, ki jih mraz, veter, vročina ali dež lahko naredijo manj smiselna."
            recommendations={waitRecommendations}
            emptyMessage="Trenutno ni večjih razlogov za prestavljanje opravil zaradi vremena."
            limit={3}
          />

          <RecommendationList
            eyebrow="Spremljaj"
            title="Na kaj bodi pozoren"
            subtitle="Kratek vremenski opomnik za zalivanje, mokre liste, vročino in opore."
            recommendations={watchRecommendations}
            emptyMessage="Vreme ne kaže posebnih dodatnih opozoril. Vseeno preveri zemljo in mikroklimo."
            limit={4}
          />
        </div>

        <ForecastStrip weather={weather} region={selectedRegion} monthlyTasks={calendarRecommendations} />

        <RecommendationList
          eyebrow="Ta teden"
          title="Ni nujno danes"
          subtitle="Opravila iz mesečnega koledarja in vremenskih pravil, ki so smiselna v naslednjih dneh."
          recommendations={thisWeekRecommendations}
          emptyMessage="Za ta teden ni dodatnih opravil za izbrano kombinacijo."
          limit={6}
        />

        <ContentQualitySections
          plants={plants}
          selectedPlantIds={selectedPlantIds}
          problemWatch={problemWatchRecommendations}
          beginnerMistakes={beginnerMistakes}
        />

      </main>

      <Footer />
    </div>
  );
}

export default App;
