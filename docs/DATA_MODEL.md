# Podatkovni model

## Rastline

Vir: `data/plants.csv` in `src/data/plants.json`

Ključna polja:

- `id`
- `slovensko_ime`
- `latinsko_ime`
- `skupina`
- `mvp_priority`
- `beginner`
- `balcony`
- `raised_bed`
- `difficulty`
- `indoor`
- `outdoor`
- `transplant`
- `harvest`
- `light`
- `soil`
- `water`
- `spacing`
- `good`
- `bad`
- `diseases`
- `pests`
- `mistakes`
- `confidence`
- `source_ids`

## Mesečna opravila

Vir: `data/calendar_tasks.csv` in `src/data/calendar_tasks.json`

Ključna polja:

- `plant_id`
- `month`
- `month_name`
- `task_type`
- `task_title`
- `task_description`
- `priority`
- `garden_type`
- `region_adjustment`
- `verification_status`
- `confidence`
- `source_ids`

## Vremenski dashboard

Vremenski podatki niso shranjeni v bazi, ampak se pridobijo sproti v `src/lib/weatherApi.ts`.

Pravila za odločanje so v `src/lib/recommendations.ts`.
