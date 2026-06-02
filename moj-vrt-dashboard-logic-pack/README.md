# Moj vrt — dashboard logic pack

Ta paket je namenjen naslednjemu koraku razvoja aplikacije **Moj vrt**. Ne dodaja več rastlin, ampak dodaja boljši podatkovni in UX sloj za preglednejši dashboard **“Kaj danes na vrtu?”**.

## Cilj paketa

Aplikacija naj uporabniku v prvih nekaj sekundah jasno pove:

1. kakšno je danes vreme za vrt,
2. kaj naj danes naredi,
3. česa naj danes ne dela,
4. na kaj naj bo pozoren.

Glavno pravilo: **stran naj bo miren dnevni planer, ne podatkovna tabela**.

## Glavne datoteke

- `data/task_types.csv` — tipi opravil in osnovna prioriteta.
- `data/weather_variables.csv` — Open-Meteo spremenljivke in izpeljani metriki.
- `data/weather_rules.csv` — pravila, kako vreme vpliva na priporočila.
- `data/task_priority_rules.csv` — logika razvrščanja in omejevanja opravil.
- `data/dashboard_sections.csv` — vrstni red in maksimalno število elementov po sekcijah.
- `data/starter_profiles.csv` — onboarding profili brez uporabniškega računa.
- `data/garden_context_rules.csv` — kontekst za balkon, visoko gredo, rastlinjak, regijo in izkušnje.
- `data/ux_copy.csv` — kratka slovenska besedila za prazna stanja, gumbe in razlage.
- `schemas/recommendation-card.schema.json` — shema za kartico priporočila.
- `docs/CODEX_NEXT_PROMPT.md` — prompt za Codex.

## Kako uporabiti v obstoječem projektu

1. Kopiraj mapo `data` v projekt ali združi posamezne CSV/JSON datoteke z obstoječo mapo `data`.
2. Kopiraj `schemas` in `docs`.
3. Codexu prilepi vsebino `docs/CODEX_NEXT_PROMPT.md`.
4. Najprej refaktoriraj dashboard, šele nato dodajaj nove rastline.

## Pomembno

Vremenska pravila so namenjena uporabniški uporabnosti, ne strokovni diagnozi. Priporočila morajo ostati informativna in previdna. Točni datumi setve ali sajenja se ne smejo izmišljati.
