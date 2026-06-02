import type { GardenType, Region } from "../types";

export const regions: Region[] = [
  {
    id: "osrednja_slovenija",
    name: "Osrednja Slovenija",
    weatherName: "Ljubljana",
    latitude: 46.0569,
    longitude: 14.5058,
    description: "Privzeti celinski okvir za MVP.",
    seasonalNote: "Upoštevaj možnost pozne spomladanske slane in vroča poletja."
  },
  {
    id: "primorska",
    name: "Primorska / Obala",
    weatherName: "Koper",
    latitude: 45.5469,
    longitude: 13.7294,
    description: "Toplejša in zgodnejša sezona, več poletne suše in vetra.",
    seasonalNote: "Toploljubne rastline so pogosto prej, vendar je poleti ključna voda."
  },
  {
    id: "gorenjska_visje_lege",
    name: "Gorenjska in višje lege",
    weatherName: "Kranj",
    latitude: 46.2397,
    longitude: 14.3556,
    description: "Hladnejša in krajša sezona.",
    seasonalNote: "Toploljubne rastline presajaj pozneje; nevarnost slane traja dlje."
  },
  {
    id: "severovzhodna_slovenija",
    name: "Severovzhodna Slovenija",
    weatherName: "Maribor",
    latitude: 46.5547,
    longitude: 15.6459,
    description: "Celinski vpliv, poletna suša in vročina sta lahko izraziti.",
    seasonalNote: "Redno spremljaj sušo, padavine in vročinske obremenitve."
  },
  {
    id: "jugovzhodna_slovenija",
    name: "Jugovzhodna Slovenija",
    weatherName: "Novo mesto",
    latitude: 45.8011,
    longitude: 15.1710,
    description: "Celinski okvir s toplimi poletji.",
    seasonalNote: "Spremljaj poletno sušo, nevihte in pozne slane po dolinah."
  },
  {
    id: "pomurje_podravje",
    name: "Pomurje / Podravje",
    weatherName: "Murska Sobota",
    latitude: 46.6625,
    longitude: 16.1664,
    description: "Topla poletja, možne suše, dobro pridelovalno območje.",
    seasonalNote: "Spomladi je lahko sezona zgodnejša kot v hladnih legah, poleti pa pazi na zalivanje."
  }
];

export const gardenTypes: GardenType[] = [
  {
    id: "klasicni_vrt",
    name: "Klasični vrt",
    description: "Greda v zemlji, največ možnosti za večje rastline."
  },
  {
    id: "visoka_greda",
    name: "Visoka greda",
    description: "Hitreje se ogreje, dobra za začetnike, zahteva redno zalivanje."
  },
  {
    id: "balkon",
    name: "Balkon / terasa",
    description: "Lonci, korita in večje posode; pomembni so volumen posode, voda in sonce."
  },
  {
    id: "rastlinjak",
    name: "Rastlinjak / tunel",
    description: "Podaljša sezono, a zahteva zračenje in pozornost pri boleznih."
  }
];
