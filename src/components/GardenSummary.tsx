import type { GardenType, Plant, Region, UserExperience } from "../types";
import { copyText } from "../lib/microcopy";

type Props = {
  region: Region;
  gardenType: GardenType;
  experience: UserExperience;
  plants: Plant[];
  selectedPlantIds: string[];
  onEdit: () => void;
};

function experienceLabel(experience: UserExperience): string {
  return experience === "zacetnik" ? "Začetnik" : "Nekaj izkušenj";
}

export function GardenSummary({ region, gardenType, experience, plants, selectedPlantIds, onEdit }: Props) {
  const selectedPlants = plants.filter((plant) => selectedPlantIds.includes(plant.id));
  const plantText = selectedPlants.length > 0
    ? selectedPlants.slice(0, 5).map((plant) => plant.slovensko_ime).join(", ")
    : "Ni izbranih rastlin";
  const overflow = selectedPlants.length > 5 ? ` +${selectedPlants.length - 5}` : "";

  return (
    <section className="garden-summary-card" aria-label="Tvoj vrt">
      <div>
        <p className="eyebrow">Tvoj vrt</p>
        <h2>{region.name}</h2>
      </div>
      <dl className="garden-summary-list">
        <div>
          <dt>Tip</dt>
          <dd>{gardenType.name}</dd>
        </div>
        <div>
          <dt>Izkušnje</dt>
          <dd>{experienceLabel(experience)}</dd>
        </div>
        <div className="garden-summary-plants">
          <dt>Rastline</dt>
          <dd>{plantText}{overflow}</dd>
        </div>
      </dl>
      <button type="button" className="ghost-button summary-edit-button" onClick={onEdit}>
        {copyText("edit_garden", "Uredi")}
      </button>
    </section>
  );
}
