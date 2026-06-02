export function Footer() {
  return (
    <footer className="site-footer">
      <p>
        Moj vrt je informativni vrtnarski dashboard. Datumi so mesečni razponi, ne strokovno jamstvo. Upoštevaj sorto, mikroklimo, stanje tal in lokalna priporočila.
      </p>
      <p>
        Vremenski podatki: Open-Meteo Forecast API, brez API ključa, za izbrano regionalno referenčno lokacijo. Strokovni podatkovni sloj v mapi <code>data/</code> označuje zanesljivost, preverjanje in vire za nadaljnjo validacijo.
      </p>
    </footer>
  );
}
