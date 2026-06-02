import type { Recommendation } from "../types";

type Props = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  emptyMessage?: string;
  recommendations: Recommendation[];
};

function labelForType(type: Recommendation["type"]): string {
  if (type === "do") return "naredi";
  if (type === "wait") return "počakaj";
  if (type === "weather") return "vreme";
  return "spremljaj";
}

export function RecommendationList({ title, subtitle, eyebrow = "Priporočila", emptyMessage, recommendations }: Props) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>

      {recommendations.length === 0 ? (
        <div className="empty-state">
          {emptyMessage ?? "Ni opravil za izbrano kombinacijo. Dodaj več rastlin ali preveri drug mesec."}
        </div>
      ) : (
        <div className="recommendation-list">
          {recommendations.map((item) => (
            <article key={item.id} className={`recommendation ${item.type}`}>
              <div className="recommendation-topline">
                <span className="pill">{labelForType(item.type)}</span>
                <span className={`priority ${item.priority}`}>{item.priority}</span>
                {item.plantName ? <span className="plant-name">{item.plantName}</span> : null}
              </div>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              <footer>
                <span>vir: {item.source ?? "koledar"}</span>
                <span>zanesljivost: {item.confidence ?? "srednja"}</span>
                {item.verification_status ? <span>preverjanje: {item.verification_status}</span> : null}
                {item.source_ids ? <span>source_ids: {item.source_ids}</span> : null}
              </footer>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
