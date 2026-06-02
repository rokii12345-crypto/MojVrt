# Data dictionary

## task_types

Opisuje vrste opravil. Uporabi za grupiranje, ikone, privzeto sekcijo in osnovno težo.

Ključna polja:

- `id`: stabilen identifikator.
- `default_section`: predlagana sekcija, če ni vremenskega pravila.
- `priority_weight`: osnovna pomembnost od 1 do 5.
- `difficulty`: zahtevnost od 1 do 5.

## weather_rules

Pretvori vremenske meritve v priporočila.

Ključna polja:

- `section`: kam gre priporočilo.
- `condition_logic`: `all` ali `any`.
- `metric_1`, `operator_1`, `value_1`: prvi pogoj.
- `metric_2`, `operator_2`, `value_2`: drugi pogoj.
- `forecast_day_offset`: 0 pomeni danes, 1 jutri.
- `lookback_days`: število dni za izpeljane metrike.
- `sort_weight`: pomembnost za razvrščanje.

## task_priority_rules

Pravila, kako omejiti in razvrstiti opravila.

Najpomembnejše:

- `max_today_items`: največ 5 glavnih opravil.
- `max_wait_items`: največ 3 opozorila.
- `duplicate_task_merge`: združi podobne kartice.
- `quiet_ui_rule`: podrobnosti skrij za klik.

## dashboard_sections

Definira vrstni red in omejitve sekcij.

## starter_profiles

Onboarding profili za začetek brez uporabniškega računa.

## garden_context_rules

Dodatna pravila za balkon, visoko gredo, rastlinjak, regijo in izkušnje.

## ux_copy

Slovenska besedila za UI. Codex naj uporablja ta besedila namesto naključnega generiranja novih.
