// Generated starter exports for Moj vrt content-quality pack.
// In the app, import JSON directly or convert CSV to TS during build.

export type Confidence = 'low' | 'medium' | 'medium_high' | 'high';

export type DailyCardTemplate = {
  card_id: string;
  plant_id: string;
  months: string;
  task_type: string;
  section: 'today' | 'wait' | 'watch' | 'this_week';
  title: string;
  short_reason: string;
  details: string;
  time_needed: string;
  priority: number;
  confidence: Confidence;
  weather_rule_ids: string;
  garden_types: string;
  source_ids: string;
};

export type BeginnerMistake = {
  mistake_id: string;
  plant_id: string;
  mistake: string;
  consequence: string;
  prevention: string;
  severity: string;
  months: string;
  confidence: Confidence;
  source_ids: string;
};

export type ProblemWatchCard = {
  problem_card_id: string;
  plant_id: string;
  problem_name: string;
  problem_type: string;
  watch_months: string;
  weather_rule_ids: string;
  early_signs: string;
  beginner_message: string;
  urgency: string;
  source_ids: string;
  confidence: Confidence;
};
