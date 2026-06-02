import type { GardenType, Plant, Region } from "../types";
import { getMonthName } from "../lib/date";

type Props = {
  regions: Region[];
  gardenTypes: GardenType[];
  plants: Plant[];
  selectedRegionId: string;
  selectedGardenTypeId: string;
  selectedMonth: number;
  selectedPlantIds: string[];
  highPriorityOnly: boolean;
  onRegionChange: (id: string) => void;
  onGardenTypeChange: (id: string) => void;
  onMonthChange: (month: number) => void;
  onPlantToggle: (id: string) => void;
  onSelectStarterPlants: () => void;
  onHighPriorityOnlyChange: (value: boolean) => void;
};

export function Controls(props: Props) {
  const mvpPlants = props.plants
    .filter((plant) => plant.mvp_priority <= 2)
    .sort((a, b) => a.slovensko_ime.localeCompare(b.slovensko_ime, "sl"));

  return (
    <section className="panel controls-panel" aria-label="Nastavitve vrta">
      <div className="panel-heading">
        <p className="eyebrow">Tvoj vrt</p>
        <h2>Nastavi dashboard</h2>
      </div>

      <div className="control-grid">
        <label>
          <span>Regija</span>
          <select value={props.selectedRegionId} onChange={(event) => props.onRegionChange(event.target.value)}>
            {props.regions.map((region) => (
              <option key={region.id} value={region.id}>{region.name}</option>
            ))}
          </select>
        </label>

        <label>
          <span>Tip vrta</span>
          <select value={props.selectedGardenTypeId} onChange={(event) => props.onGardenTypeChange(event.target.value)}>
            {props.gardenTypes.map((type) => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
        </label>

        <label>
          <span>Mesec</span>
          <select value={props.selectedMonth} onChange={(event) => props.onMonthChange(Number(event.target.value))}>
            {Array.from({ length: 12 }, (_, index) => index + 1).map((month) => (
              <option key={month} value={month}>{getMonthName(month)}</option>
            ))}
          </select>
        </label>

        <label className="toggle-row">
          <input
            type="checkbox"
            checked={props.highPriorityOnly}
            onChange={(event) => props.onHighPriorityOnlyChange(event.target.checked)}
          />
          <span>Samo visoka prioriteta</span>
        </label>
      </div>

      <div className="plant-picker-heading">
        <div>
          <h3>Rastline</h3>
          <p>Začni z rastlinami, ki jih res imaš. To izboljša priporočila.</p>
        </div>
        <button type="button" className="ghost-button" onClick={props.onSelectStarterPlants}>Izberi začetni paket</button>
      </div>

      <div className="plant-chips">
        {mvpPlants.map((plant) => {
          const selected = props.selectedPlantIds.includes(plant.id);
          return (
            <button
              key={plant.id}
              type="button"
              className={selected ? "chip selected" : "chip"}
              onClick={() => props.onPlantToggle(plant.id)}
              aria-pressed={selected}
            >
              {plant.slovensko_ime}
            </button>
          );
        })}
      </div>
    </section>
  );
}
