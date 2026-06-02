# Naloga za Codex — Moj vrt

Preberi celoten projekt in nadaljuj razvoj spletne aplikacije **Moj vrt**.

## Cilj

Izdelaj lep, uporaben slovenski vrtnarski dashboard za začetnike.

Glavni ekran mora odgovoriti na vprašanje:

> Kaj se danes splača narediti na vrtu?

Uporabnik izbere:

- regijo,
- tip vrta,
- mesec,
- rastline, ki jih ima.

Aplikacija mora združiti:

1. mesečni koledar opravil iz `calendar_tasks.json`,
2. lastnosti rastlin iz `plants.json`,
3. vremensko napoved prek javnega Open-Meteo API,
4. varnostna pravila za pozebo, dež, vročino, sušo in veter.

## Najprej preveri

- `src/App.tsx`
- `src/lib/weatherApi.ts`
- `src/lib/recommendations.ts`
- `src/data/regions.ts`
- `src/styles.css`
- `data/plants.csv`
- `data/calendar_tasks.csv`

## Obvezno izboljšaj

1. Dodaj shranjevanje izbire uporabnika v `localStorage`.
2. Dodaj lepši onboarding za prvega uporabnika.
3. Dodaj filter: samo opravila z visoko prioriteto.
4. Dodaj razdelek “Raje počakaj”, ki loči vremensko tvegana opravila od opravil za danes.
5. Dodaj jasnejšo atribucijo za Open-Meteo.
6. Dodaj prazna stanja, če uporabnik ne izbere nobene rastline.
7. Preglej odzivnost na telefonu.
8. Ne skrivaj `confidence` in `verification_status` — uporabnik mora vedeti, kako zanesljiv je podatek.

## Vizualni slog

- vrtna tema,
- veliko zelene,
- nežni krem odtenki,
- zaobljene kartice,
- ne preveč kričeče,
- moderno, ampak mirno,
- bolj “uporaben vrtni planer” kot “AI chatbot”.

## Pomembna pravila

- Ne predstavljaj informativnih nasvetov kot strokovno jamstvo.
- Ne izmišljaj točnih datumov setve ali sajenja.
- Uporabljaj mesečne razpone.
- Za strokovno vsebino vedno ohrani polja `confidence`, `source_ids` in `verification_status`.
- Vremenska priporočila naj bodo praktična: zalivanje, zaščita pred slano, presajanje, delo v vročini, veter, dež, bolezni po mokrem vremenu.

## GitHub

Repozitorij uporabnika:

```txt
https://github.com/rokii12345-crypto/MojVrt.git
```

Po spremembah predlagaj uporabniku ukaze:

```bash
git add .
git commit -m "Add Moj vrt dashboard starter"
git push
```
