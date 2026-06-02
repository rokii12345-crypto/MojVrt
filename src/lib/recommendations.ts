import type { CalendarTask, DailySummary, GardenType, Plant, Recommendation, Region, WeatherDay, WeatherSnapshot } from "../types";

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
  const recommendations = buildWeatherRecommendationsForDay(weather.today, region, "weather-today", weather.currentHumidity);
  const tomorrow = weather.days[1];

  if (tomorrow) {
    const tomorrowRain = tomorrow.precipitationSum ?? 0;
    const tomorrowRainProbability = tomorrow.precipitationProbabilityMax ?? 0;
    if (tomorrowRain >= 5 || tomorrowRainProbability >= 70) {
      recommendations.push(weatherRecommendation({
        id: "weather-tomorrow-rain",
        title: "Jutri kaže na dež: danes pripravi vrt",
        body: "Danes lahko pobereš občutljive plodove, utrdiš opore in preskočiš močno zalivanje. Setev ali presajanje načrtuj z mislijo na mokra tla.",
        type: "weather",
        priority: "srednja"
      }));
    }
  }

  const dryDays = weather.days.slice(0, 5).filter((day) => {
    const rain = day.precipitationSum ?? 0;
    const probability = day.precipitationProbabilityMax ?? 0;
    return rain < 2 && probability < 45;
  }).length;

  if (dryDays >= 4) {
    recommendations.push(weatherRecommendation({
      id: "weather-dry-spell",
      title: "Več zaporednih suhih dni: spremljaj vlago v zemlji",
      body: "Visoke grede, lonci in sveže setve se hitreje izsušijo. Zalivaj zjutraj ali zvečer in preveri zemljo nekaj centimetrov pod površino.",
      type: "weather",
      priority: "srednja"
    }));
  }

  const wetDiseaseRisk = weather.days.slice(0, 3).some((day) => (day.precipitationSum ?? 0) >= 4 || (day.precipitationProbabilityMax ?? 0) >= 75);
  if ((weather.currentHumidity ?? 0) >= 85 || wetDiseaseRisk) {
    recommendations.push(weatherRecommendation({
      id: "weather-humidity-disease-risk",
      title: "Vlaga: spremljaj bolezni na listih",
      body: "Po mokrem ali zelo vlažnem vremenu preglej paradižnik, kumare, bučke, solato in jagode. Zalivaj ob korenini in poskrbi za zračnost rastlin.",
      type: "watch",
      priority: "srednja"
    }));
  }

  return sortRecommendations(recommendations).slice(0, 8);
}

function weatherRecommendation(args: Pick<Recommendation, "id" | "title" | "body" | "type" | "priority">): Recommendation {
  return {
    ...args,
    source: "weather",
    confidence: "srednja",
    verification_status: "vremenska ocena iz javne napovedi; preveri lokalno mikroklimo",
    source_ids: "OPEN_METEO"
  };
}

export function buildWeatherRecommendationsForDay(day: WeatherDay, region: Region, prefix = "weather", humidity?: number): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const min = day.minTemperature ?? 99;
  const max = day.maxTemperature ?? -99;
  const rain = day.precipitationSum ?? 0;
  const rainProbability = day.precipitationProbabilityMax ?? 0;
  const wind = day.windSpeedMax ?? 0;

  if (min <= 3) {
    recommendations.push(weatherRecommendation({
      id: `${prefix}-frost`,
      title: "Nevarnost slane ali hladnega stresa",
      body: "Ne presajaj toploljubnih rastlin na prosto. Mlade sadike zaščiti s kopreno, tunelom ali jih čez noč prestavi v zavetje.",
      type: "wait",
      priority: "visoka"
    }));
  }

  if (max >= 30) {
    recommendations.push(weatherRecommendation({
      id: `${prefix}-heat`,
      title: "Vroč dan: zalivaj zgodaj ali zvečer",
      body: "Raje ne presajaj opoldne. Posode in visoke grede se hitro izsušijo; preveri vlago zemlje s prstom.",
      type: "weather",
      priority: "visoka"
    }));
  } else if (max >= 26 && rain < 2) {
    recommendations.push(weatherRecommendation({
      id: `${prefix}-warm-dry`,
      title: "Toplo in suho: preveri zalivanje",
      body: "Predvsem lonci, balkon in visoka greda potrebujejo redno kontrolo vlage. Zalivaj ob korenini, ne po listih.",
      type: "do",
      priority: "srednja"
    }));
  }

  if (rainProbability >= 70 || rain >= 5 || (day.date && rain > 0 && prefix.includes("today"))) {
    recommendations.push(weatherRecommendation({
      id: `${prefix}-rain`,
      title: "Dež: preskoči rutinsko zalivanje",
      body: "Dan je bolj primeren za pregled rastlin, vezanje opor, setev v notranjih prostorih ali pripravo orodja. Po dežju spremljaj bolezni na listih.",
      type: "watch",
      priority: rain >= 5 || rainProbability >= 70 ? "srednja" : "nizka"
    }));
  }

  if (wind >= 35) {
    recommendations.push(weatherRecommendation({
      id: `${prefix}-wind`,
      title: "Vetrovno: utrdi opore in ne škropi",
      body: "Preveri paradižnik, fižol, kumare in mlade sadike. Delo s škropivi in listnimi pripravki preloži.",
      type: "wait",
      priority: "srednja"
    }));
  }

  if ((humidity ?? 0) >= 85 || (rain >= 3 && max >= 18)) {
    recommendations.push(weatherRecommendation({
      id: `${prefix}-leaf-disease-risk`,
      title: "Vlažno vreme: preglej liste",
      body: "Pri gosti zasaditvi in mokrih listih spremljaj prve znake pegavosti, plesni ali gnitja. Ne zalivaj po listih.",
      type: "watch",
      priority: "srednja"
    }));
  }

  if (recommendations.length === 0) {
    recommendations.push(weatherRecommendation({
      id: `${prefix}-good-day`,
      title: "Dober dan za običajna vrtna opravila",
      body: `V regiji ${region.name} vreme ne kaže večjih opozoril. Izberi opravila po mesečnem koledarju in preveri stanje zemlje pred zalivanjem.`,
      type: "do",
      priority: "nizka"
    }));
  }

  return sortRecommendations(recommendations);
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

  return sortRecommendations([...urgentWeather, ...safeCalendar, ...weather.filter((item) => !urgentWeather.includes(item))])
    .slice(0, 20);
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
      title: "Nalagam današnjo vremensko sliko",
      body: "Ko bo napoved naložena, bo dashboard razvrstil opravila po tem, kaj je danes smiselno narediti, prestaviti ali samo spremljati.",
      tone: "weather"
    };
  }

  if (args.selectedPlantCount === 0) {
    return {
      title: "Najprej izberi svoje rastline",
      body: `Za ${args.region.name} že spremljam vreme, ko pa izbereš rastline, bom dodal koledarska opravila za današnji mesec.`,
      tone: "weather"
    };
  }

  if (args.waitCount > 0) {
    return {
      title: "Danes delaj previdno",
      body: `Na vrtu je ${args.waitCount} vremensko tveganje. Začni z varnimi opravili, presajanje in delo z občutljivimi rastlinami pa preveri v razdelku Raje počakaj.`,
      tone: "caution"
    };
  }

  if (args.doCount > 0) {
    return {
      title: "Danes je dober dan za vrt",
      body: `Za tvoj izbor imam ${args.doCount} predlogov za danes. Vreme ne kaže večjih omejitev, vseeno preveri vlago zemlje in stanje rastlin.`,
      tone: "good"
    };
  }

  return {
    title: "Danes predvsem opazuj",
    body: `Za izbrane rastline ni veliko nujnih opravil. Spremljaj vreme, vlago zemlje in morebitne znake bolezni ali škodljivcev.`,
    tone: args.watchCount > 0 ? "weather" : "good"
  };
}

function sortRecommendations(recommendations: Recommendation[]): Recommendation[] {
  return recommendations.sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority));
}
