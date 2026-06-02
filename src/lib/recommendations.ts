import type { CalendarTask, GardenType, Plant, Recommendation, Region, WeatherDay, WeatherSnapshot } from "../types";

function priorityRank(priority: string): number {
  if (priority === "visoka") return 0;
  if (priority === "srednja") return 1;
  return 2;
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

export function getMonthlyTasksForSelection(args: {
  plants: Plant[];
  tasks: CalendarTask[];
  selectedPlantIds: string[];
  gardenType: GardenType;
  month: number;
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
    .sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority))
    .slice(0, 18)
    .map((task, index) => {
      const plant = plantMap.get(task.plant_id);
      return {
        id: `calendar-${task.plant_id}-${task.month}-${task.task_type}-${index}`,
        title: task.task_title,
        body: task.task_description,
        type: task.priority === "visoka" ? "do" : "watch",
        priority: task.priority as Recommendation["priority"],
        plantId: task.plant_id,
        plantName: plant?.slovensko_ime,
        source: "calendar",
        confidence: task.confidence,
        verification_status: task.verification_status,
        source_ids: task.source_ids
      } satisfies Recommendation;
    });
}

export function getWeatherRecommendations(weather: WeatherSnapshot | null, region: Region): Recommendation[] {
  if (!weather) return [];
  return buildWeatherRecommendationsForDay(weather.today, region, "weather-today");
}

export function buildWeatherRecommendationsForDay(day: WeatherDay, region: Region, prefix = "weather"): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const min = day.minTemperature ?? 99;
  const max = day.maxTemperature ?? -99;
  const rain = day.precipitationSum ?? 0;
  const rainProbability = day.precipitationProbabilityMax ?? 0;
  const wind = day.windSpeedMax ?? 0;

  if (min <= 3) {
    recommendations.push({
      id: `${prefix}-frost`,
      title: "Nevarnost slane ali hladnega stresa",
      body: "Ne presajaj toploljubnih rastlin na prosto. Mlade sadike zaščiti s kopreno, tunelom ali jih čez noč prestavi v zavetje.",
      type: "wait",
      priority: "visoka",
      source: "weather",
      confidence: "srednja",
      verification_status: "vremenska ocena iz javne napovedi; preveri lokalno mikroklimo",
      source_ids: "OPEN_METEO"
    });
  }

  if (max >= 30) {
    recommendations.push({
      id: `${prefix}-heat`,
      title: "Vroč dan: zalivaj zgodaj ali zvečer",
      body: "Raje ne presajaj opoldne. Posode in visoke grede se hitro izsušijo; preveri vlago zemlje s prstom.",
      type: "weather",
      priority: "visoka",
      source: "weather",
      confidence: "srednja",
      verification_status: "vremenska ocena iz javne napovedi; preveri lokalno mikroklimo",
      source_ids: "OPEN_METEO"
    });
  } else if (max >= 26 && rain < 2) {
    recommendations.push({
      id: `${prefix}-warm-dry`,
      title: "Toplo in suho: preveri zalivanje",
      body: "Predvsem lonci, balkon in visoka greda potrebujejo redno kontrolo vlage. Zalivaj ob korenini, ne po listih.",
      type: "do",
      priority: "srednja",
      source: "weather",
      confidence: "srednja",
      verification_status: "vremenska ocena iz javne napovedi; preveri lokalno mikroklimo",
      source_ids: "OPEN_METEO"
    });
  }

  if (rainProbability >= 70 || rain >= 5) {
    recommendations.push({
      id: `${prefix}-rain`,
      title: "Dež: preskoči rutinsko zalivanje",
      body: "Dan je bolj primeren za pregled rastlin, vezanje opor, setev v notranjih prostorih ali pripravo orodja. Po dežju spremljaj bolezni na listih.",
      type: "watch",
      priority: "srednja",
      source: "weather",
      confidence: "srednja",
      verification_status: "vremenska ocena iz javne napovedi; preveri lokalno mikroklimo",
      source_ids: "OPEN_METEO"
    });
  }

  if (wind >= 35) {
    recommendations.push({
      id: `${prefix}-wind`,
      title: "Vetrovno: utrdi opore in ne škropi",
      body: "Preveri paradižnik, fižol, kumare in mlade sadike. Delo s škropivi in listnimi pripravki preloži.",
      type: "wait",
      priority: "srednja",
      source: "weather",
      confidence: "srednja",
      verification_status: "vremenska ocena iz javne napovedi; preveri lokalno mikroklimo",
      source_ids: "OPEN_METEO"
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      id: `${prefix}-good-day`,
      title: "Dober dan za običajna vrtna opravila",
      body: `V regiji ${region.name} vreme ne kaže večjih opozoril. Izberi opravila po mesečnem koledarju in preveri stanje zemlje pred zalivanjem.`,
      type: "do",
      priority: "nizka",
      source: "weather",
      confidence: "srednja",
      verification_status: "vremenska ocena iz javne napovedi; preveri lokalno mikroklimo",
      source_ids: "OPEN_METEO"
    });
  }

  return recommendations;
}

export function mergeTodayRecommendations(calendar: Recommendation[], weather: Recommendation[]): Recommendation[] {
  const urgentWeather = weather.filter((item) => item.priority === "visoka" || item.type === "wait");
  const safeCalendar = calendar.map((item) => {
    const hasFrostWarning = urgentWeather.some((warning) => warning.id.includes("frost"));
    const isTransplant = item.title.toLowerCase().includes("presadi") || item.body.toLowerCase().includes("presajaj");
    if (hasFrostWarning && isTransplant) {
      return {
        ...item,
        type: "wait" as const,
        title: `Počakaj: ${item.title}`,
        body: `${item.body} Zaradi nizkih temperatur danes tega raje ne opravi brez zaščite.`
      };
    }
    return item;
  });

  return [...urgentWeather, ...safeCalendar, ...weather.filter((item) => !urgentWeather.includes(item))]
    .sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority))
    .slice(0, 20);
}
