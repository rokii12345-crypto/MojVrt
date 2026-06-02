# Implementation notes for Codex

## Predlagan tok podatkov

1. Fetch weather forecast za izbrano regijo.
2. Normalize weather data v notranji objekt.
3. Izračunaj derived metrike:
   - precipitation_3d
   - precipitation_7d
   - hot_days_3d
   - relative_humidity_avg, če uporabljaš hourly podatke
   - soil_temperature_6cm_avg, če uporabljaš hourly podatke
4. Filtriraj mesečna opravila glede na trenutni mesec in izbrane rastline.
5. Uporabi weather_rules in ustvari weather recommendation kartice.
6. Uporabi task_priority_rules za scoring.
7. Združi podobne kartice.
8. Razdeli po dashboard_sections.
9. Omeji število prikazanih kartic po sekcijah.

## Priporočena struktura kode

- `src/lib/weatherApi.ts` — fetch + normalize Open-Meteo.
- `src/lib/weatherRules.ts` — evaluateWeatherRules().
- `src/lib/taskScoring.ts` — scoreTasks(), mergeDuplicates().
- `src/lib/recommendations.ts` — buildRecommendationCards().
- `src/lib/userGardenStorage.ts` — localStorage helper.
- `src/components/DashboardHero.tsx`
- `src/components/DashboardSection.tsx`
- `src/components/RecommendationCard.tsx`
- `src/components/StarterProfiles.tsx`
- `src/components/ForecastStrip.tsx`

## Operatorji

Podpri:

- `>`
- `>=`
- `<`
- `<=`
- `=`
- `between` z vrednostjo `min|max`
- `in` z vrednostjo `a|b|c`

## Prazna stanja

Če ni izbranih rastlin:

- ne prikaži praznega dashboarda,
- prikaži starter profile,
- pod njimi možnost ročne izbire rastlin.

## UI omejitve

- Ne prikazuj več kot 5 glavnih opravil.
- Ne prikazuj raw CSV podatkov.
- Podrobnosti skrij za `Zakaj?`.
- Confidence in viri naj bodo v razširjenem delu kartice.

## Najpomembnejša UX izboljšava

Prej: veliko podatkov naenkrat.

Potem: en dnevni povzetek + 3 jasne sekcije.
