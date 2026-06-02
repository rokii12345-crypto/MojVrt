export function describeWeatherCode(code?: number): string {
  if (code === undefined) return "vreme ni znano";
  if (code === 0) return "jasno";
  if ([1, 2, 3].includes(code)) return "delno oblačno";
  if ([45, 48].includes(code)) return "megla";
  if ([51, 53, 55, 56, 57].includes(code)) return "rosenje";
  if ([61, 63, 65, 66, 67].includes(code)) return "dež";
  if ([71, 73, 75, 77].includes(code)) return "sneg";
  if ([80, 81, 82].includes(code)) return "plohe";
  if ([85, 86].includes(code)) return "snežne plohe";
  if ([95, 96, 99].includes(code)) return "nevihta";
  return "spremenljivo vreme";
}

export function weatherEmoji(code?: number): string {
  if (code === undefined) return "🌿";
  if (code === 0) return "☀️";
  if ([1, 2, 3].includes(code)) return "⛅";
  if ([45, 48].includes(code)) return "🌫️";
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "🌧️";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "❄️";
  if ([95, 96, 99].includes(code)) return "⛈️";
  return "🌦️";
}
