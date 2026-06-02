import taskTypesRaw from "../../moj-vrt-dashboard-logic-pack/data/task_types.json";
import weatherRulesRaw from "../../moj-vrt-dashboard-logic-pack/data/weather_rules.json";
import type {
  CalendarTask,
  DailySummary,
  DashboardSectionId,
  GardenType,
  Plant,
  Recommendation,
  Region,
  UserExperience,
  WeatherDay,
  WeatherSnapshot
} from "../types";

type TaskTypeDefinition = {
  id: string;
  name: string;
  short_label: string;
  default_section: DashboardSectionId;
  priority_weight: number;
  default_time_needed: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
};

type WeatherRule = {
  id: string;
  active: "yes" | "no";
  section: DashboardSectionId;
  condition_logic: "all" | "any";
  metric_1: string;
  operator_1: string;
  value_1: string | number;
  metric_2?: string;
  operator_2?: string;
  value_2?: string | number;
  forecast_day_offset: number;
  severity: "low" | "medium" | "high";
  title: string;
  short_message: string;
  detail: string;
  recommended_action: string;
  avoid_action: string;
  applies_months: string;
  applies_garden_types: string;
  applies_task_types: string;
  confidence: "low" | "medium" | "high";
  source_ids: string;
  ui_badge: string;
  sort_weight: number;
};

const taskTypes = taskTypesRaw as TaskTypeDefinition[];
const weatherRules = weatherRulesRaw as WeatherRule[];

function priorityRank(priority: string): number {
  if (priority === "visoka") return 0;
  if (priority === "srednja") return 1;
  return 2;
}

function priorityScore(priority: string): number {
  if (priority === "visoka") return 82;
  if (priority === "srednja") return 58;
  return 35;
}

function confidenceToLocal(confidence: string): Recommendation["confidence"] {
  if (confidence === "high") return "visoka";
  if (confidence === "medium") return "srednja";
  return "nizka";
}

function confidenceToVerification(confidence: string): string {
  if (confidence === "high") return "splošno_sprejeto";
  if (confidence === "medium") return "splošno_sprejeto";
  return "potrebno_preveriti";
}

function appGardenTypeId(gardenType: GardenType): string {
  return gardenType.id === "klasicni_vrt" ? "vrt" : gardenType.id;
}

function gardenTypeMatches(task: CalendarTask, gardenType: GardenType): boolean {
  const raw = `${task.garden_type}`.toLowerCase();
  if (gardenType.id === "klasicni_vrt") return true;
  if (gardenType.id === "visoka_greda") return raw.includes("visoka") || raw.includes("vrt") || raw.includes("vsi");
  if (gardenType.id === "balkon") return raw.includes("lonec") || raw.includes("balkon") || raw.includes("posod") || raw.includes("vsi");
  if (gardenType.id === "rastlinjak") return raw.includes("notranji") || raw.includes("sadike") || raw.includes("vrt") || raw.includes("vsi");
  return true;
}

function plantAllowedForGarden(plant: Plant, gardenType: GardenType): boolean {
  if (gardenType.id === "balkon") return plant.balcony;
  if (gardenType.id === "visoka_greda") return plant.raised_bed;
  return true;
}

function normalizeTaskType(taskType: string): string {
  const normalized = taskType.toLowerCase();
  if (normalized.includes("setev_notri")) return "sowing_indoor";
  if (normalized.includes("setev_na_prosto")) return "sowing_outdoor";
  if (normalized.includes("presaj")) return "transplanting";
  if (normalized.includes("sajenje")) return "planting";
  if (normalized.includes("obiranje")) return "harvesting";
  if (normalized.includes("nega")) return "disease_check";
  if (normalized.includes("zalivanje")) return "watering";
  return "planning";
}

function taskTypeDefinition(taskType: string): TaskTypeDefinition {
  return taskTypes.find((definition) => definition.id === taskType) ?? taskTypes.find((definition) => definition.id === "planning")!;
}

function sectionFromTask(task: CalendarTask, definition: TaskTypeDefinition): DashboardSectionId {
  if (task.confidence === "nizka" || task.source_ids?.includes("VERIFY_NEEDED")) return "this_week";
  if (task.priority === "visoka" && definition.default_section === "today") return "today";
  return definition.default_section === "today" ? "this_week" : definition.default_section;
}

export function getMonthlyTasksForSelection(args: {
  plants: Plant[];
  tasks: CalendarTask[];
  selectedPlantIds: string[];
  gardenType: GardenType;
  month: number;
  experience: UserExperience;
}): Recommendation[] {
  const selectedPlants = args.plants.filter((plant) => args.selectedPlantIds.includes(plant.id));
  const plantMap = new Map(selectedPlants.map((plant) => [plant.id, plant]));

  return args.tasks
    .filter((task) => task.month === args.month)
    .filter((task) => plantMap.has(task.plant_id))
    .filter((task) => gardenTypeMatches(task, args.gardenType))
    .filter((task) => {
      const plant = plantMap.get(task.plant_id);
      return plant ? plantAllowedForGarden(plant, args.gardenType) : false;
    })
    .map((task, index) => {
      const plant = plantMap.get(task.plant_id);
      const normalizedTaskType = normalizeTaskType(task.task_type);
      const definition = taskTypeDefinition(normalizedTaskType);
      const section = sectionFromTask(task, definition);
      const beginnerBoost = args.experience === "zacetnik" && definition.difficulty <= 2 ? 6 : 0;
      const score = priorityScore(task.priority) + definition.priority_weight * 3 + beginnerBoost;

      return {
        id: `calendar-${task.plant_id}-${task.month}-${task.task_type}-${index}`,
        section,
        title: task.task_title,
        body: task.task_description,
        short_reason: task.task_description.split(".")[0].slice(0, 138),
        type: section === "today" ? "do" : section === "wait" ? "wait" : "watch",
        priority: task.priority as Recommendation["priority"],
        score,
        task_type: normalizedTaskType,
        time_needed: definition.default_time_needed,
        difficulty: definition.difficulty,
        plantId: task.plant_id,
        plantName: plant?.slovensko_ime,
        source: "calendar",
        confidence: task.confidence,
        verification_status: task.verification_status.includes("preveri") ? "potrebno_preveriti" : "splošno_sprejeto",
        source_ids: task.source_ids?.split(";") ?? [],
        details: `${task.task_description} ${task.region_adjustment ? `Regijska opomba: ${task.region_adjustment}` : ""}`.trim(),
        recommended_action: task.task_description,
        ui_badge: definition.short_label
      } satisfies Recommendation;
    })
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0) || priorityRank(a.priority) - priorityRank(b.priority));
}

function listIncludes(list: string, value: string): boolean {
  return list.split(",").map((item) => item.trim()).includes(value) || list === "all";
}

function valueForMetric(day: WeatherDay, metric: string): number | undefined {
  if (metric === "temperature_max") return day.maxTemperature;
  if (metric === "temperature_min") return day.minTemperature;
  if (metric === "precipitation_sum") return day.precipitationSum;
  if (metric === "precipitation_probability_max") return day.precipitationProbabilityMax;
  if (metric === "wind_speed_max") return day.windSpeedMax;
  if (metric === "wind_gusts_max") return day.windGustsMax;
  if (metric === "weather_code") return day.weatherCode;
  if (metric === "relative_humidity_avg") return day.humidityAvg;
  if (metric === "precipitation_3d") return day.precipitation3d;
  if (metric === "precipitation_7d") return day.precipitation7d;
  if (metric === "hot_days_3d") return day.hotDays3d;
  return undefined;
}

function compareMetric(actual: number | undefined, operator: string | undefined, expected: string | number | undefined): boolean {
  if (actual === undefined || !operator || expected === undefined || expected === "") return false;
  if (operator === "between") {
    const [min, max] = String(expected).split("|").map(Number);
    return actual >= min && actual <= max;
  }
  if (operator === "in") {
    return String(expected).split("|").map(Number).includes(actual);
  }
  const numericExpected = Number(expected);
  if (operator === ">") return actual > numericExpected;
  if (operator === ">=") return actual >= numericExpected;
  if (operator === "<") return actual < numericExpected;
  if (operator === "<=") return actual <= numericExpected;
  if (operator === "=") return actual === numericExpected;
  return false;
}

function ruleMatches(rule: WeatherRule, weather: WeatherSnapshot, gardenType: GardenType, month: number): boolean {
  if (rule.active !== "yes") return false;
  if (!listIncludes(rule.applies_months, String(month))) return false;
  if (!listIncludes(rule.applies_garden_types, appGardenTypeId(gardenType))) return false;

  const day = weather.days[rule.forecast_day_offset] ?? weather.today;
  const checks = [
    compareMetric(valueForMetric(day, rule.metric_1), rule.operator_1, rule.value_1)
  ];

  if (rule.metric_2 && rule.operator_2 && rule.value_2 !== "") {
    checks.push(compareMetric(valueForMetric(day, rule.metric_2), rule.operator_2, rule.value_2));
  }

  return rule.condition_logic === "any" ? checks.some(Boolean) : checks.every(Boolean);
}

function weatherRuleToRecommendation(rule: WeatherRule): Recommendation {
  const type = rule.section === "today" ? "do" : rule.section === "wait" ? "wait" : "watch";
  return {
    id: `weather-${rule.id}`,
    section: rule.section,
    title: rule.title,
    body: rule.detail,
    short_reason: rule.short_message,
    type,
    priority: rule.severity === "high" ? "visoka" : rule.severity === "medium" ? "srednja" : "nizka",
    score: rule.sort_weight,
    task_type: rule.applies_task_types.split(",")[0] ?? "watch",
    time_needed: rule.section === "wait" ? "0 min" : rule.applies_task_types.includes("watering") ? "5–20 min" : "5–15 min",
    difficulty: 1,
    source: "weather",
    confidence: confidenceToLocal(rule.confidence),
    verification_status: confidenceToVerification(rule.confidence),
    source_ids: rule.source_ids.split(","),
    weather_rule_ids: [rule.id],
    details: rule.detail,
    recommended_action: rule.recommended_action,
    avoid_action: rule.avoid_action,
    ui_badge: rule.ui_badge
  };
}

export function getWeatherRecommendations(weather: WeatherSnapshot | null, region: Region, gardenType: GardenType, month: number): Recommendation[] {
  if (!weather) return [];
  const matched = weatherRules
    .filter((rule) => ruleMatches(rule, weather, gardenType, month))
    .map(weatherRuleToRecommendation);

  if (matched.length > 0) return sortRecommendations(matched).slice(0, 12);

  return [weatherRuleToRecommendation({
    id: "good_day_general",
    active: "yes",
    section: "today",
    condition_logic: "all",
    metric_1: "temperature_max",
    operator_1: ">=",
    value_1: 0,
    forecast_day_offset: 0,
    severity: "low",
    title: "Dober dan za mirna vrtna opravila",
    short_message: `V regiji ${region.name} vreme ne kaže večjih vrtnih omejitev.`,
    detail: "Izberi mesečna opravila za svoje rastline in pred zalivanjem preveri dejansko vlago zemlje.",
    recommended_action: "Začni z najlažjim opravilom iz današnjega seznama.",
    avoid_action: "Ne zalivaj na pamet; najprej preveri zemljo.",
    applies_months: "1,2,3,4,5,6,7,8,9,10,11,12",
    applies_garden_types: "vrt,visoka_greda,balkon,rastlinjak",
    applies_task_types: "planning",
    confidence: "medium",
    source_ids: "open_meteo_docs",
    ui_badge: "vreme",
    sort_weight: 20
  } as WeatherRule)];
}

export function buildWeatherRecommendationsForDay(day: WeatherDay, region: Region, prefix = "weather"): Recommendation[] {
  const snapshot: WeatherSnapshot = {
    locationName: region.weatherName,
    fetchedAt: "",
    today: day,
    days: [day]
  };
  return getWeatherRecommendations(snapshot, region, { id: "klasicni_vrt", name: "Vrt", description: "" }, new Date(day.date).getMonth() + 1)
    .map((item) => ({ ...item, id: `${prefix}-${item.id}` }));
}

export function mergeTodayRecommendations(calendar: Recommendation[], weather: Recommendation[]): Recommendation[] {
  const blockingWeather = weather.filter((item) => item.section === "wait" || item.priority === "visoka");
  const hasFrostWarning = blockingWeather.some((warning) => warning.weather_rule_ids?.includes("frost_risk_warning"));
  const hasHeatWarning = blockingWeather.some((warning) => warning.weather_rule_ids?.includes("very_hot_avoid_transplanting"));
  const hasWindWarning = blockingWeather.some((warning) => warning.weather_rule_ids?.includes("windy_avoid_spraying_transplanting"));

  const adjustedCalendar = calendar.map((item) => {
    const isTransplant = item.task_type === "transplanting" || item.title.toLowerCase().includes("presadi");
    if ((hasFrostWarning || hasHeatWarning || hasWindWarning) && isTransplant) {
      return {
        ...item,
        section: "wait" as const,
        type: "wait" as const,
        score: (item.score ?? 50) + 20,
        title: `Prestavi: ${item.title}`,
        short_reason: "Vreme danes ni najboljše za občutljive sadike.",
        avoid_action: "Presajanje prestavi na mirnejši in blažji del dneva ali drug dan."
      };
    }
    return item;
  });

  return sortRecommendations([...weather, ...adjustedCalendar]);
}

export function buildDailySummary(args: {
  weather: WeatherSnapshot | null;
  region: Region;
  doCount: number;
  waitCount: number;
  watchCount: number;
  selectedPlantCount: number;
}): DailySummary {
  if (!args.weather) {
    return {
      title: "Nalagam današnjo vremensko sliko.",
      body: "Ko bo napoved naložena, bo dashboard razvrstil opravila po tem, kaj je danes smiselno narediti, prestaviti ali samo spremljati.",
      tone: "weather"
    };
  }

  const today = args.weather.today;
  const weatherPart = `${today.minTemperature ?? "–"}–${today.maxTemperature ?? "–"} °C, ${today.precipitationSum ?? 0} mm dežja, veter do ${today.windSpeedMax ?? "–"} km/h`;

  if (args.selectedPlantCount === 0) {
    return {
      title: `Danes: ${weatherPart}.`,
      body: `Za ${args.region.name} že spremljam vreme; izberi starter profil, da dobiš jasna vrtna opravila.`,
      tone: "weather"
    };
  }

  if (args.waitCount > 0) {
    return {
      title: `Danes previdno: ${weatherPart}.`,
      body: `Najprej preveri razdelek Raje počakaj, nato izberi eno varno opravilo.`,
      tone: "caution"
    };
  }

  return {
    title: `Danes: ${weatherPart}.`,
    body: args.doCount > 0
      ? `Za tvoj vrt imam ${args.doCount} jasnih predlogov; začni z najvišjo kartico.`
      : "Danes ni veliko nujnega dela; predvsem preveri vlago zemlje in stanje rastlin.",
    tone: args.watchCount > 0 ? "weather" : "good"
  };
}

function sortRecommendations(recommendations: Recommendation[]): Recommendation[] {
  return recommendations.sort((a, b) => (b.score ?? 0) - (a.score ?? 0) || priorityRank(a.priority) - priorityRank(b.priority));
}
