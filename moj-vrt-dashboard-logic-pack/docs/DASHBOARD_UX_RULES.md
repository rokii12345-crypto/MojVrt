# UX pravila za dashboard “Kaj danes na vrtu?”

## Glavna usmeritev

Stran je trenutno lahko preveč nametana, če prikaže preveč podatkov hkrati. Cilj je miren, jasen dashboard.

Uporabnik mora v prvih 5 sekundah razumeti:

1. današnji vrtni povzetek,
2. 3–5 glavnih opravil,
3. kaj naj raje prestavi,
4. na kaj naj bo pozoren zaradi vremena.

## Struktura strani

### 1. Hero

Prikaži:

- naslov: `Kaj danes na vrtu?`
- en kratek povzetek v enem stavku,
- regijo in vreme v majhnem, nevsiljivem prikazu.

Ne prikazuj dolgih razlag, vseh rastlin ali vseh podatkov na vrhu.

### 2. Tri glavne kartice ali stolpci

- `Danes naredi`
- `Raje počakaj`
- `Spremljaj`

Vsaka sekcija ima omejitev:

- Danes naredi: največ 5 elementov
- Raje počakaj: največ 3 elementi
- Spremljaj: največ 4 elementi

### 3. Kartica priporočila

Kartica naj ima samo:

- naslov,
- kratek razlog,
- čas izvedbe,
- oznako, če je vremensko povezano,
- gumb `Zakaj?`.

Podrobnosti, viri, confidence in daljša pojasnila naj bodo skriti za razširitvijo.

### 4. Spodnji del strani

Nižje na strani prikaži:

- 7-dnevno vreme,
- opravila za ta teden,
- izbrane rastline,
- razlago virov in zanesljivosti.

## Vizualni slog

- svetlo krem ozadje,
- mehka vrtna zelena,
- bele ali rahlo zelene kartice,
- zaobljeni robovi,
- nežne sence,
- veliko praznega prostora,
- brez preveč ikon,
- brez kričečih barv,
- mobilno naj bo v enem stolpcu.

## Layout omejitve

- Glavni wrapper na desktopu: `max-width: 1100px`.
- Hero naj ima dovolj prostora okoli sebe.
- Vsaka glavna sekcija naj ima jasno naslovno vrstico.
- Na mobilnem naj bo vrstni red:
  1. hero,
  2. danes naredi,
  3. raje počakaj,
  4. spremljaj,
  5. vreme,
  6. ta teden.

## Kaj ne sme biti na prvem zaslonu

- dolg seznam vseh rastlin,
- vse mesečne naloge,
- celotna vremenska tabela,
- vse tehnične oznake,
- surovi podatki iz CSV.

## Glavno pravilo

Manj elementov, boljši vrstni red, več praznega prostora.
