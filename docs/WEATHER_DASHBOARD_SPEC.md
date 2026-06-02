# Specifikacija: Kaj danes?

## Namen

Dashboard mora uporabniku vsak dan povedati, kaj naj naredi na vrtu.

Ne sme biti samo koledar. Biti mora odločilni pomočnik:

- danes naredi,
- raje počakaj,
- spremljaj,
- naslednjih 7 dni.

## Vhodni podatki

- regija,
- tip vrta,
- rastline,
- mesec,
- vremenska napoved.

## Vremenski podatki

V MVP uporabljamo Open-Meteo:

- trenutna temperatura,
- relativna vlaga,
- padavine,
- weather code,
- veter,
- dnevna minimalna temperatura,
- dnevna maksimalna temperatura,
- vsota padavin,
- verjetnost padavin,
- maksimalna hitrost vetra.

## Osnovna pravila

### Pozeba / slana

Če je minimalna temperatura <= 3 °C:

- ne presajaj toploljubnih rastlin,
- zaščiti sadike,
- prestavi lonce v zavetje.

### Vročina

Če je maksimalna temperatura >= 30 °C:

- zalivaj zgodaj ali zvečer,
- ne presajaj opoldne,
- preveri lonce in visoke grede.

### Suho in toplo

Če je maksimalna temperatura >= 26 °C in padavin skoraj ni:

- preveri zalivanje,
- zalivaj ob korenini.

### Dež

Če je verjetnost padavin >= 70 % ali vsota padavin >= 5 mm:

- preskoči rutinsko zalivanje,
- ne delaj po mokrih rastlinah, če ni nujno,
- po mokrem vremenu spremljaj bolezni.

### Veter

Če je maksimalni veter >= 35 km/h:

- utrdi opore,
- ne škropi,
- zaščiti mlade sadike.

## Nadaljnje izboljšave

- ARSO agrometeorološki podatki za temperaturo tal.
- Lokalna opozorila za pozebo.
- Personalizirani opomniki.
- Koledar za posamezno rastlino.
- SEO strani po mesecih in rastlinah.
