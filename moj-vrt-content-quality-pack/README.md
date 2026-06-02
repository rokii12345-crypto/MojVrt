# Moj vrt — content quality pack

Datum priprave: 2026-06-02

Ta paket je namenjen naslednjemu koraku po UX refaktorju: izboljšati kakovost dnevnih kartic in rastlinskih vsebin, brez dodajanja velike količine novih rastlin.

## Vsebina

- `data/plants_enriched.csv` — 20 prioritetnih rastlin z boljšimi opisi in pogoji.
- `data/daily_card_templates.csv` — kratke kartice za dashboard, filtrirane po mesecih, vremenu, tipu vrta in rastlini.
- `data/problem_watch_cards.csv` — kartice “Spremljaj” za bolezni, škodljivce in rastne težave.
- `data/beginner_mistakes.csv` — najpogostejše napake začetnikov po rastlinah.
- `data/companion_pairs_quality.csv` — osnovni dobri/slabi sosedje z zanesljivostjo.
- `data/seo_content_plan.csv` — SEO strani za rastline in “kdaj sejati/saditi” po rastlinah.
- `data/dashboard_microcopy.csv` — kratka besedila za UI.
- `data/content_status.csv` — uredniški status po rastlini.
- `data/sources.csv` — katalog virov in licenčne opombe.

## Uredniško pravilo

Podatki so pripravljeni za MVP, ne kot dokončna agronomska verifikacija. V aplikaciji ne prikazuj nizko zanesljivih podatkov kot glavno priporočilo. Točni datumi naj se ne izmišljajo; uporabljajo se mesečni razponi in vremenska opozorila.

## Glavni cilj v aplikaciji

Dashboard naj prikaže največ 3–5 glavnih dnevnih opravil, 3 opozorila “Raje počakaj” in 4 kartice “Spremljaj”. Vse ostalo gre v razdelek “Ta teden” ali za gumb “Pokaži več”.
