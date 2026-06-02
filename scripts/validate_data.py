import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
SRC_DATA = ROOT / "src" / "data"

required_files = [
    DATA / "plants.csv",
    DATA / "calendar_tasks.csv",
    SRC_DATA / "plants.json",
    SRC_DATA / "calendar_tasks.json",
]

errors = []
for path in required_files:
    if not path.exists():
        errors.append(f"Missing file: {path}")

if not errors:
    plants = list(csv.DictReader(open(DATA / "plants.csv", encoding="utf-8")))
    tasks = list(csv.DictReader(open(DATA / "calendar_tasks.csv", encoding="utf-8")))
    plant_ids = {row["id"] for row in plants}

    for row in tasks:
        if row["plant_id"] not in plant_ids:
            errors.append(f"Task references unknown plant: {row['plant_id']}")
        try:
            month = int(row["month"])
            if month < 1 or month > 12:
                errors.append(f"Invalid month for {row['plant_id']}: {row['month']}")
        except ValueError:
            errors.append(f"Non-numeric month for {row['plant_id']}: {row['month']}")

    plants_json = json.load(open(SRC_DATA / "plants.json", encoding="utf-8"))
    tasks_json = json.load(open(SRC_DATA / "calendar_tasks.json", encoding="utf-8"))
    if len(plants_json) != len(plants):
        errors.append("plants.csv and plants.json count mismatch")
    if len(tasks_json) != len(tasks):
        errors.append("calendar_tasks.csv and calendar_tasks.json count mismatch")

if errors:
    print("ERROR")
    for error in errors:
        print("-", error)
    raise SystemExit(1)

print(f"OK: {len(plants)} plants, {len(tasks)} calendar tasks")
