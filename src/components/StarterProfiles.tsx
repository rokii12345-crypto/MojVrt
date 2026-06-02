export type StarterProfile = {
  id: string;
  title: string;
  description: string;
  region_id: string;
  garden_type: string;
  experience: string;
  plant_ids: string;
  onboarding_order: number;
  hero_hint: string;
};

type Props = {
  profiles: StarterProfile[];
  onSelectProfile: (profile: StarterProfile) => void;
};

export function StarterProfiles({ profiles, onSelectProfile }: Props) {
  return (
    <section className="onboarding-panel">
      <div className="onboarding-copy">
        <p className="eyebrow">Prvi korak</p>
        <h2>Izberi začetni vrt</h2>
        <p>Za začetek izberi profil. Kasneje lahko rastline, regijo in tip vrta spremeniš ročno.</p>
      </div>
      <div className="starter-profile-grid">
        {profiles.map((profile) => (
          <button key={profile.id} type="button" className="starter-profile" onClick={() => onSelectProfile(profile)}>
            <strong>{profile.title}</strong>
            <span>{profile.description}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
