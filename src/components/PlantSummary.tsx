import type { GardenType, Plant } from "../types";

type Props = {
  plants: Plant[];
  selectedPlantIds: string[];
  gardenType: GardenType;
};

export function PlantSummary({ plants, selectedPlantIds, gardenType }: Props) {
  const selected = plants.filter((plant) => selectedPlantIds.includes(plant.id));
  const unsuitable = selected.filter((plant) => {
    if (gardenType.id === "balkon") return !plant.balcony;
    if (gardenType.id === "visoka_greda") return !plant.raised_bed;
    return false;
  });

  return (
    <section className="panel compact-panel">
      <div className="panel-heading">
        <p className="eyebrow">Rastline</p>
        <h2>Tvoj izbor</h2>
      </div>
      {selected.length === 0 ? (
        <div className="empty-state">Izberi vsaj eno rastlino, da dobiš koledarska opravila in opozorila za svoj vrt.</div>
      ) : (
        <div className="summary-list">
          {selected.slice(0, 8).map((plant) => (
            <div key={plant.id} className="summary-item">
              <strong>{plant.slovensko_ime}</strong>
              <span>{plant.skupina} · zahtevnost {plant.difficulty}/5</span>
            </div>
          ))}
        </div>
      )}
      {unsuitable.length > 0 ? (
        <div className="soft-warning">
          Za izbrani tip vrta preveri primernost: {unsuitable.map((plant) => plant.slovensko_ime).join(", ")}.
        </div>
      ) : null}
    </section>
  );
}
