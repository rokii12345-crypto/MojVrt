import { useState } from "react";
import type { Recommendation } from "../types";

type Props = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  emptyMessage?: string;
  recommendations: Recommendation[];
  limit?: number;
};

function labelForType(type: Recommendation["type"]): string {
  if (type === "do") return "naredi";
  if (type === "wait") return "počakaj";
  if (type === "weather") return "vreme";
  return "spremljaj";
}

function sourceText(sourceIds: Recommendation["source_ids"]): string {
  if (!sourceIds) return "—";
  return Array.isArray(sourceIds) ? sourceIds.join(", ") : sourceIds;
}

function confidenceLabel(confidence: Recommendation["confidence"]): string {
  if (confidence === "nizka" || confidence === "low") return "potrebno preveriti";
  if (confidence === "visoka" || confidence === "high") return "dobro podprto";
  return "splošno priporočilo";
}

function sectionIcon(title: string, eyebrow: string): { emoji: string; label: string } {
  const text = `${eyebrow} ${title}`.toLowerCase();
  if (text.includes("počakaj")) return { emoji: "⏳", label: "počakaj" };
  if (text.includes("spremljaj")) return { emoji: "👀", label: "spremljaj" };
  if (text.includes("teden")) return { emoji: "🗓️", label: "teden" };
  return { emoji: "🌱", label: "naredi" };
}

function cardIcon(item: Recommendation): { emoji: string; label: string } {
  const task = `${item.task_type ?? ""} ${item.type}`.toLowerCase();
  if (item.type === "wait") return { emoji: "🧺", label: "preloži opravilo" };
  if (item.type === "weather" || item.type === "watch") return { emoji: "🌦️", label: "vremensko opozorilo" };
  if (task.includes("zalivanje")) return { emoji: "💧", label: "zalivanje" };
  if (task.includes("setev") || task.includes("sajenje")) return { emoji: "🌿", label: "sajenje" };
  if (task.includes("obiranje") || task.includes("žetev")) return { emoji: "🥬", label: "obiranje" };
  if (task.includes("zaščita")) return { emoji: "🛡️", label: "zaščita" };
  return { emoji: "🌱", label: "vrtno opravilo" };
}

export function RecommendationList({ title, subtitle, eyebrow = "Priporočila", emptyMessage, recommendations, limit }: Props) {
  const [expanded, setExpanded] = useState(false);
  const visibleRecommendations = expanded || !limit ? recommendations : recommendations.slice(0, limit);
  const hiddenCount = limit ? Math.max(recommendations.length - limit, 0) : 0;
  const icon = sectionIcon(title, eyebrow);

  return (
    <section className="panel">
      <div className="panel-heading">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="section-title">
          <span className="emoji-badge" role="img" aria-label={icon.label}>{icon.emoji}</span>
          {title}
        </h2>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>

      {recommendations.length === 0 ? (
        <div className="empty-state">
          {emptyMessage ?? "Ni opravil za izbrano kombinacijo. Dodaj več rastlin ali preveri drug mesec."}
        </div>
      ) : (
        <div className="recommendation-list">
          {visibleRecommendations.map((item) => {
            const itemIcon = cardIcon(item);
            return (
              <article key={item.id} className={`recommendation ${item.type}`}>
                <div className="recommendation-topline">
                  <span className="card-emoji" role="img" aria-label={itemIcon.label}>{itemIcon.emoji}</span>
                  <span className="pill">{labelForType(item.type)}</span>
                  {item.ui_badge ? <span className="pill subtle-pill">{item.ui_badge}</span> : null}
                  {item.plantName ? <span className="plant-name">{item.plantName}</span> : null}
                </div>
                <h3>{item.title}</h3>
                <p>{item.short_reason ?? item.body}</p>
                <div className="card-meta">
                  <span>{item.time_needed ?? "5–15 min"}</span>
                  <span>{item.task_type ?? item.source ?? "opravilo"}</span>
                </div>
                <details>
                  <summary>Zakaj?</summary>
                  <div className="details-body">
                    <p>{item.details ?? item.body}</p>
                    {item.recommended_action ? <p><strong>Priporočeno:</strong> {item.recommended_action}</p> : null}
                    {item.avoid_action ? <p><strong>Raje ne:</strong> {item.avoid_action}</p> : null}
                    <footer>
                      <span>zanesljivost: {confidenceLabel(item.confidence)}</span>
                      {item.verification_status ? <span>preverjanje: {item.verification_status}</span> : null}
                      <span>viri: {sourceText(item.source_ids)}</span>
                    </footer>
                  </div>
                </details>
              </article>
            );
          })}
          {hiddenCount > 0 ? (
            <button type="button" className="ghost-button show-more-button" onClick={() => setExpanded((current) => !current)}>
              {expanded ? "Prikaži manj" : `Pokaži več (${hiddenCount})`}
            </button>
          ) : null}
        </div>
      )}
    </section>
  );
}
