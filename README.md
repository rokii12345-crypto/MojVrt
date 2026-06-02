# Moj vrt — dashboard starter

Delujoč Vite + React + TypeScript starter za slovenski vrtnarski dashboard.

Glavna ideja aplikacije:

> Uporabnik izbere regijo, tip vrta in svoje rastline. Aplikacija za današnji dan pove, kaj se splača narediti na vrtu, pri čemer združi mesečni koledar opravil in vremensko napoved.

## Funkcije v tem starterju

- začetna stran **Kaj danes na vrtu?**
- izbira regije: Osrednja Slovenija, Primorska, Gorenjska/višje lege, Severovzhodna Slovenija, Jugovzhodna Slovenija, Pomurje/Podravje
- izbira tipa vrta: klasični vrt, visoka greda, balkon, rastlinjak
- izbor rastlin iz MVP baze
- vremenska napoved prek Open-Meteo API brez API ključa
- vremenska pravila za:
  - pozebo / slano,
  - dež,
  - vročino,
  - sušo,
  - veter,
  - zalivanje,
  - presajanje
- 7-dnevni pregled: kaj se splača delati naslednje dni
- podatkovni paket: 50 rastlin, mesečna opravila, viri, težave, sosedje, SEO strani
- umirjena zelena vrtna tema

## Zagon

```bash
npm install
npm run dev
```

Odpri:

```txt
http://localhost:5173
```

## Build

```bash
npm run build
```

## Validacija podatkov

```bash
npm run validate:data
```

## Podatkovna struktura

Najpomembnejše datoteke:

```txt
data/plants.csv
data/calendar_tasks.csv
data/companions.csv
data/problems.csv
data/seo_pages.csv
src/data/plants.json
src/data/calendar_tasks.json
src/data/regions.ts
src/lib/recommendations.ts
src/lib/weatherApi.ts
```

## Vremenski vir

Starter uporablja Open-Meteo Forecast API, ker za osnovno uporabo ne zahteva API ključa in vrača JSON. Za produkcijo dodaj vidno atribucijo vira in preveri pogoje uporabe glede obsega prometa.

## Pomembno

To je MVP podatkovni in tehnični starter. Vrtnarski nasveti so informativni. Datumi so mesečni razponi in so odvisni od sorte, mikroklime, nadmorske višine, temperature tal in aktualnega vremena.
