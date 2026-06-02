Preberi ta paket `moj-vrt-dashboard-logic-pack` in ga uporabi za naslednji refaktor aplikacije Moj vrt.

Glavni cilj:
Trenutna stran deluje preveč skupaj nametana in nepregledna. Potrebujemo miren, pregleden dashboard “Kaj danes na vrtu?”, ki uporabniku v prvih 5 sekundah pove:

1. kakšno je danes vreme za vrt,
2. kaj naj danes naredi,
3. česa naj danes raje ne dela,
4. na kaj naj bo pozoren.

Uporabi podatke iz teh datotek:

- `data/task_types.csv`
- `data/weather_variables.csv`
- `data/weather_rules.csv`
- `data/task_priority_rules.csv`
- `data/dashboard_sections.csv`
- `data/starter_profiles.csv`
- `data/garden_context_rules.csv`
- `data/ux_copy.csv`
- `schemas/recommendation-card.schema.json`
- `docs/DASHBOARD_UX_RULES.md`
- `docs/WEATHER_RULES_EXPLAINED.md`

Naloge:

1. Refaktoriraj glavni dashboard.
   - Na vrhu naj bo hero “Kaj danes na vrtu?”.
   - Dodaj en kratek dnevni povzetek v enem stavku.
   - Pod hero prikaži tri glavne sekcije: “Danes naredi”, “Raje počakaj”, “Spremljaj”.

2. Omeji količino informacij.
   - “Danes naredi” največ 5 kartic.
   - “Raje počakaj” največ 3 kartice.
   - “Spremljaj” največ 4 kartice.
   - Vse ostalo naj gre v “Ta teden” ali za gumb “Pokaži več”.

3. Uporabi kartice priporočil.
   Vsaka kartica naj ima:
   - naslov,
   - kratek razlog,
   - čas izvedbe,
   - oznako tipa opravila ali vremena,
   - gumb “Zakaj?” za podrobnosti.

4. Izboljšaj vremensko logiko.
   Uporabi `weather_rules.csv` in `weather_variables.csv`.
   Podpri vsaj:
   - dež danes,
   - močnejši dež,
   - suho obdobje,
   - vroč dan,
   - zelo vroč dan,
   - hladna noč,
   - možnost pozebe,
   - veter,
   - toplo + vlažno vreme,
   - balkon in visoka greda se hitreje sušita.

5. Vremenska integracija.
   Uporabi Open-Meteo brez API ključa.
   Zahtevaj daily parametre:
   - `temperature_2m_max`
   - `temperature_2m_min`
   - `precipitation_sum`
   - `precipitation_probability_max`
   - `wind_speed_10m_max`
   - `wind_gusts_10m_max`
   - `weather_code`
   Dodatno, če je enostavno:
   - `uv_index_max`
   - hourly `relative_humidity_2m`
   - hourly `soil_temperature_6cm`

6. Dodaj onboarding.
   Če uporabnik še nima nastavitev v localStorage, prikaži profile iz `starter_profiles.csv`:
   - Balkonski začetnik
   - Visoka greda za začetnike
   - Klasičen zelenjavni vrt
   - Zeliščni kotiček

7. Shrani izbiro v localStorage.
   Shrani:
   - regija,
   - tip vrta,
   - izkušnje,
   - izbrane rastline,
   - izbrani starter profil.

8. Izboljšaj vizualni slog.
   Slog mora biti:
   - vrtna tema,
   - veliko zelene,
   - svetlo krem ozadje,
   - mehke kartice,
   - zaobljeni robovi,
   - nežne sence,
   - veliko praznega prostora,
   - moderno, mirno, ne preveč vpadljivo.

9. Mobilni izgled.
   Na mobilnem naj bo vse v enem stolpcu:
   - hero,
   - Danes naredi,
   - Raje počakaj,
   - Spremljaj,
   - Vrtno vreme,
   - Ta teden.

10. Ne izmišljaj strokovnih datumov.
    Uporabljaj obstoječe mesečne podatke iz koledarja. Če je podatek nezanesljiv, pokaži oznako `potrebno preveriti` ali ga ne prikaži kot glavni nasvet.

11. Dodaj atribucijo.
    V UI dodaj besedilo:
    “Vremenski podatki: Open-Meteo. Priporočila so informativna.”

12. Stran naj ne deluje kot AI chatbot.
    To je dnevni vrtnarski planer za začetnike.

Končni cilj verzije:
Uporabnik odpre stran in takoj vidi jasen, kratek, uporaben odgovor na vprašanje: “Kaj naj danes naredim na vrtu?”
