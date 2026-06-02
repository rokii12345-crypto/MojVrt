
from pathlib import Path
import csv, sys
base = Path(__file__).resolve().parents[1]
required = [
  'data/task_types.csv',
  'data/weather_variables.csv',
  'data/weather_rules.csv',
  'data/task_priority_rules.csv',
  'data/dashboard_sections.csv',
  'data/starter_profiles.csv',
  'data/garden_context_rules.csv',
  'data/ux_copy.csv',
]
errors = []
for rel in required:
    p = base / rel
    if not p.exists():
        errors.append(f'Missing: {rel}')
    else:
        with p.open(encoding='utf-8') as f:
            rows = list(csv.DictReader(f))
        if not rows:
            errors.append(f'No rows: {rel}')

# Validate weather rule references roughly
with (base/'data/weather_rules.csv').open(encoding='utf-8') as f:
    wr = list(csv.DictReader(f))
rule_ids = set()
for r in wr:
    if r['id'] in rule_ids:
        errors.append(f'Duplicate weather rule id: {r["id"]}')
    rule_ids.add(r['id'])
    if r['section'] not in {'today','wait','watch','this_week'}:
        errors.append(f'Bad section in {r["id"]}: {r["section"]}')
    if r['severity'] not in {'low','medium','high'}:
        errors.append(f'Bad severity in {r["id"]}: {r["severity"]}')
    if r['confidence'] not in {'low','medium','high'}:
        errors.append(f'Bad confidence in {r["id"]}: {r["confidence"]}')

if errors:
    print('ERRORS:')
    for e in errors:
        print('-', e)
    sys.exit(1)
print(f'OK: {len(rule_ids)} weather rules, {sum(1 for _ in open(base/"data/task_types.csv", encoding="utf-8"))-1} task types')
