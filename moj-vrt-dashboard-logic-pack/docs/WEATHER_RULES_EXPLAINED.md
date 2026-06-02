# Vremenska pravila — razlaga

Paket uporablja vremenska pravila za pretvorbo vremenske napovedi v uporabna dnevna priporočila.

## Vhodni podatki

Priporočeni Open-Meteo parametri:

Daily:

- `temperature_2m_max`
- `temperature_2m_min`
- `precipitation_sum`
- `precipitation_probability_max`
- `wind_speed_10m_max`
- `wind_gusts_10m_max`
- `weather_code`
- `uv_index_max` optional
- `et0_fao_evapotranspiration` optional

Hourly / derived:

- `relative_humidity_2m` → dnevno povprečje
- `soil_temperature_6cm` → dnevno povprečje, optional
- `precipitation_3d` → izpeljano iz več dni
- `precipitation_7d` → izpeljano iz več dni
- `hot_days_3d` → izpeljano iz dnevnih temperatur

## Pravila naj bodo previdna

Pravila niso strokovna diagnoza bolezni ali škodljivcev. So praktični opomniki.

Primer:

- Toplo + vlažno vreme ne pomeni “rastlina ima bolezen”.
- Pomeni samo: “pogosteje preveri liste in zračenje”.

## Sekcije

- `today`: priporočila, ki jih je smiselno opraviti danes.
- `wait`: stvari, ki jih je danes bolje prestaviti.
- `watch`: stvari, ki jih je dobro spremljati.
- `this_week`: nenujna opravila za naslednje dni.

## Zanesljivost

- `high`: osnovno, splošno varno priporočilo, npr. ne presajaj med pozebo.
- `medium`: uporabno splošno pravilo, odvisno od vrta.
- `low`: prikazuj previdno in nižje, npr. modelna temperatura tal.

## Atribucija

V UI mora biti jasno navedeno:

`Vremenski podatki: Open-Meteo. Priporočila so informativna.`
