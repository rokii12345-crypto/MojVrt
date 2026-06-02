export type Confidence = "nizka" | "srednja" | "visoka" | string;

export type Plant = {
  id: string;
  slovensko_ime: string;
  latinsko_ime?: string;
  skupina: string;
  mvp_priority: number;
  beginner: boolean;
  balcony: boolean;
  raised_bed: boolean;
  difficulty: number;
  indoor?: string;
  outdoor?: string;
  transplant?: string;
  harvest?: string;
  light?: string;
  soil?: string;
  water?: string;
  spacing?: string;
  good?: string;
  bad?: string;
  diseases?: string;
  pests?: string;
  mistakes?: string;
  description?: string;
  warnings?: string;
  confidence: Confidence;
  source_ids?: string;
};

export type CalendarTask = {
  plant_id: string;
  month: number;
  month_name: string;
  task_type: string;
  task_title: string;
  task_description: string;
  priority: "visoka" | "srednja" | "nizka" | string;
  garden_type: string;
  region_adjustment: string;
  verification_status: string;
  confidence: Confidence;
  source_ids?: string;
};

export type Region = {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  weatherName: string;
  seasonalNote: string;
};

export type GardenType = {
  id: string;
  name: string;
  description: string;
};

export type WeatherSnapshot = {
  locationName: string;
  fetchedAt: string;
  currentTemperature?: number;
  currentHumidity?: number;
  currentPrecipitation?: number;
  currentWindSpeed?: number;
  currentWeatherCode?: number;
  today: WeatherDay;
  days: WeatherDay[];
};

export type WeatherDay = {
  date: string;
  weatherCode?: number;
  minTemperature?: number;
  maxTemperature?: number;
  precipitationSum?: number;
  precipitationProbabilityMax?: number;
  windSpeedMax?: number;
};

export type Recommendation = {
  id: string;
  title: string;
  body: string;
  type: "do" | "wait" | "watch" | "weather";
  priority: "visoka" | "srednja" | "nizka";
  plantId?: string;
  plantName?: string;
  source?: "calendar" | "weather" | "combined";
  confidence?: Confidence;
  verification_status?: string;
  source_ids?: string;
};
