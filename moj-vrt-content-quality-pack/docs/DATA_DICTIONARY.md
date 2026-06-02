# Data dictionary

## plants_enriched
- `id`: stabilen ID rastline, uporabi ga v URL in relacijah.
- `diff`: zahtevnost 1–5.
- `beginner`: `da`, `ne` ali `srednje`.
- `balcony`, `raised`: primernost za balkon/visoko gredo; lahko je `da`, `ne`, `delno`.
- `months`: meseci, ko je rastlina relevantna za dashboard.
- `source`: seznam source_id, ločen s podpičjem.

## daily_card_templates
- `section`: ciljna sekcija (`today`, `wait`, `watch`, `this_week`).
- `weather_rule_ids`: seznam vremenskih pravil iz prejšnjega logic packa; prazen pomeni sezonska kartica.
- `priority`: osnovna prioriteta 1–10.
- `confidence`: podatkovna zanesljivost. `low` ne sme v glavne kartice.
- `garden_types`: za katere tipe vrta je kartica primerna.

## problem_watch_cards
Kartice za “Spremljaj”, ki se sprožijo po mesecu, vremenu in izbranih rastlinah.

## beginner_mistakes
Uporabi v nižjem razdelku ali na strani rastline. Ne prikazuj vseh napak na dashboardu.

## companion_pairs_quality
Ni popolna strokovna tabela. Uporabi z oznako zanesljivosti. Nizko zanesljive povezave naj bodo v produkciji skrite ali označene za pregled.
