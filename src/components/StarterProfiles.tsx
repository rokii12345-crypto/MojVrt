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

function profileIcon(profile: StarterProfile): { emoji: string; label: string } {
  if (profile.id.includes("balcony")) return { emoji: "🪴", label: "balkonski vrt" };
  if (profile.id.includes("raised")) return { emoji: "🥕", label: "visoka greda" };
  if (profile.id.includes("herb")) return { emoji: "🌿", label: "zelišča" };
  return { emoji: "🌻", label: "zelenjavni vrt" };
}

export function StarterProfiles({ profiles, onSelectProfile }: Props) {
  return (
    <section className="onboarding-panel">
      <div className="onboarding-copy">
        <p className="eyebrow">Prvi korak</p>
        <h2 className="section-title">
          <span className="emoji-badge" role="img" aria-label="začetni vrt">🪴</span>
          Izberi začetni vrt
        </h2>
        <p>Za začetek izberi profil. Kasneje lahko rastline, regijo in tip vrta spremeniš ročno.</p>
      </div>
      <div className="starter-profile-grid">
        {profiles.map((profile) => {
          const icon = profileIcon(profile);
          return (
            <button key={profile.id} type="button" className="starter-profile" onClick={() => onSelectProfile(profile)}>
              <span className="profile-emoji" role="img" aria-label={icon.label}>{icon.emoji}</span>
              <strong>{profile.title}</strong>
              <span>{profile.description}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
