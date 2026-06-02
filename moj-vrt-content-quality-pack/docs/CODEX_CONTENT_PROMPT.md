Preberi paket `moj-vrt-content-quality-pack` in ga vključi v obstoječo aplikacijo Moj vrt.

Namen paketa:
- izboljšati kakovost dnevnih kartic,
- zmanjšati občutek nametanosti,
- prikazati samo najbolj uporabne informacije,
- dodati boljše rastlinske opise, napake začetnikov, problem-watch kartice in SEO načrt.

Uporabi datoteke:
- data/plants_enriched.csv ali .json
- data/daily_card_templates.csv ali .json
- data/problem_watch_cards.csv ali .json
- data/beginner_mistakes.csv ali .json
- data/companion_pairs_quality.csv ali .json
- data/dashboard_microcopy.csv ali .json
- data/content_status.csv ali .json
- schemas/daily-card-template.schema.json

Naloge:

1. Uvozi `daily_card_templates` v recommendation engine.
   Kartice filtriraj po:
   - trenutnem mesecu,
   - izbranih rastlinah,
   - tipu vrta,
   - sproženih weather_rule_ids,
   - confidence.

2. Prioritizacija:
   - če je rastlina izbrana, +3,
   - če je mesec trenutni, +5,
   - če se ujema weather_rule_id, +4,
   - če je confidence low, kartice ne prikaži v glavnih sekcijah,
   - glavni dashboard naj nikoli ne prikaže več kot:
     - 5 kartic “Danes naredi”,
     - 3 kartice “Raje počakaj”,
     - 4 kartice “Spremljaj”.

3. Kartice naj bodo kratke.
   Prikaz na kartici:
   - title,
   - short_reason,
   - time_needed,
   - task_type kot majhna oznaka,
   - gumb “Zakaj?”, ki razširi details.

4. Dodaj razdelek “Pogoste napake začetnikov”.
   Naj bo nižje na strani, ne v prvem zaslonu.
   Prikaži samo za izbrane rastline.

5. Dodaj razdelek “Spremljaj pri svojih rastlinah”.
   Uporabi `problem_watch_cards` in ga poveži z vremenom:
   - mokro/toplo vreme → bolezni,
   - suho/vroče vreme → zalivanje in škodljivci,
   - hladno/mokra tla → slab vznik stročnic.

6. Uporabi `dashboard_microcopy` za UI besedila.

7. Dodaj “Viri” tako, da so v podrobnostih kartic navedeni source_ids, vendar naj uporabniku ne preobremeniš glavnega UI-ja.

8. SEO podatkov ne implementiraj kot strani takoj, ampak pripravi routing načrt:
   - /rastline/:slug
   - /kdaj/:slug

9. Vizualno:
   - stran naj ostane mirna,
   - kartice naj imajo veliko zraka,
   - rastlinske podrobnosti naj bodo nižje ali v razširitvah,
   - ne prikaži vseh tabel naenkrat.

Najpomembnejše pravilo:
Ne dodajaj novih rastlin, dokler dashboard ni pregleden. Uporabi teh 20 rastlin kot kakovostno jedro MVP-ja.
