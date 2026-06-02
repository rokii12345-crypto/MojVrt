import csv
from pathlib import Path

root = Path(__file__).resolve().parents[1]

def read(name):
    with open(root / 'data' / name, encoding='utf-8') as f:
        return list(csv.DictReader(f))

plants = read('plants_enriched.csv')
cards = read('daily_card_templates.csv')
problems = read('problem_watch_cards.csv')
mistakes = read('beginner_mistakes.csv')
sources = read('sources.csv')
plant_ids = {p['id'] for p in plants}
source_ids = {s['source_id'] for s in sources}
errors = []

for c in cards:
    if c['plant_id'] not in plant_ids:
        errors.append(f"Unknown plant in card {c['card_id']}: {c['plant_id']}")
    if c['section'] not in {'today','wait','watch','this_week'}:
        errors.append(f"Bad section in {c['card_id']}: {c['section']}")
    if len(c['title']) > 120:
        errors.append(f"Title too long in {c['card_id']}")
    for sid in filter(None, c['source_ids'].split(';')):
        if sid not in source_ids:
            errors.append(f"Unknown source {sid} in {c['card_id']}")

for row in problems + mistakes:
    if row['plant_id'] not in plant_ids:
        errors.append(f"Unknown plant in row: {row}")
    for sid in filter(None, row['source_ids'].split(';')):
        if sid not in source_ids:
            errors.append(f"Unknown source {sid} in row {row}")

if errors:
    print('ERRORS:')
    for e in errors:
        print('-', e)
    raise SystemExit(1)

print(f"OK: {len(plants)} plants, {len(cards)} daily card templates, {len(problems)} problem cards, {len(mistakes)} beginner mistakes")
