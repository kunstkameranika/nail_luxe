// Builds site/ka/, site/ru/, site/en/ and the root files from src/content.mjs.
// Run: node src/build.mjs
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { config, artists, services, serviceCol, groups, t } from "./content.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "site");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const wa = (phone, text) => `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
const owner = artists.find((a) => a.owner);
const fontsBase = "https://fonts.googleapis.com/css2?family=Onest:wght@400&family=Spectral:wght@300;400&display=swap";
const fontsKa = "https://fonts.googleapis.com/css2?family=Noto+Sans+Georgian:wght@400&family=Noto+Serif+Georgian:wght@300;400&display=swap";
const fontsKaName = `https://fonts.googleapis.com/css2?family=Noto+Sans+Georgian:wght@400&text=${encodeURIComponent(t.ka.langName)}&display=swap`;

// Fresha link for the studio or one artist; "#" until config.fresha is filled in.
const fresha = (who) => config.fresha[who] || "#";
const freshaAttrs = (who) => (config.fresha[who] ? 'target="_blank" rel="noopener"' : 'data-pending="fresha"');

const ext = 'target="_blank" rel="noopener"';

function page(lang) {
  const L = t[lang];
  const col = serviceCol[lang];
  const alt = config.langs.map((l) => `<link rel="alternate" hreflang="${l}" href="${config.siteUrl}/${l}/">`).join("\n");
  const langNav = config.langs
    .map((l) => (l === lang ? `<a href="../${l}/" aria-current="page" lang="${l}">${t[l].langName}</a>` : `<a href="../${l}/" lang="${l}" hreflang="${l}">${t[l].langName}</a>`))
    .join("");

  const rows = groups
    .map((g) => {
      const items = services.filter((s) => s[0] === g);
      return `<tbody id="g-${g}">
        <tr class="group"><th scope="rowgroup" colspan="3">${esc(L.groups[g])}</th></tr>
        ${items.map((s) => `<tr><th scope="row">${esc(s[col])}</th><td class="num">${s[1]} ${L.min}</td><td class="num price">${s[2]} ₾</td></tr>`).join("\n        ")}
      </tbody>`;
    })
    .join("\n      ");

  const strips = groups
    .map((g, i) => `<a class="strip" href="#g-${g}" style="--stain: var(--stain-${i + 1})">${esc(L.strips[g])}</a>`)
    .join("");

  const artistCards = artists
    .map((a) => {
      return `<article class="artist stock">
        <h3>${esc(L.names[a.id])}</h3>
        <p class="role">${esc(L.roles[a.id])}</p>
        <p class="phone"><a href="tel:${a.phone}">${a.phoneShown}</a></p>
        <div class="artist-actions">
          <a class="btn" href="${esc(fresha(a.id))}" ${freshaAttrs(a.id)}>${esc(L.bookWith[a.id])}</a>
          <a class="link" href="${esc(wa(a.phone, L.waText))}" ${ext}>WhatsApp</a>
        </div>
      </article>`;
    })
    .join("\n      ");

  const ld = {
    "@context": "https://schema.org",
    "@type": "NailSalon",
    name: "NAIL LUXE",
    url: `${config.siteUrl}/${lang}/`,
    image: `${config.siteUrl}/assets/brand/icon-512.png`,
    telephone: owner.phone,
    priceRange: "5–90 GEL",
    paymentAccepted: "Cash, Credit Card",
    currenciesAccepted: "GEL",
    address: { "@type": "PostalAddress", streetAddress: "4B Petre Iberi St", addressLocality: "Tbilisi", postalCode: "0159", addressCountry: "GE" },
    openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], opens: config.hours.opens, closes: config.hours.closes }],
    ...(config.instagram ? { sameAs: [config.instagram] } : {}),
  };

  return `<!doctype html>
<html lang="${L.htmlLang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(L.title)}</title>
<meta name="description" content="${esc(L.description)}">
<link rel="canonical" href="${config.siteUrl}/${lang}/">
${alt}
<link rel="alternate" hreflang="x-default" href="${config.siteUrl}/">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(L.title)}">
<meta property="og:description" content="${esc(L.description)}">
<meta property="og:image" content="${config.siteUrl}/assets/brand/icon-512.png">
<meta property="og:locale" content="${{ ka: "ka_GE", ru: "ru_RU", en: "en_US" }[lang]}">
<meta name="theme-color" content="#efe9e2">
<link rel="icon" href="../assets/brand/icon-32.png" sizes="32x32">
<link rel="apple-touch-icon" href="../assets/brand/icon-180.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${fontsBase}">
${lang === "ka" ? `<link rel="stylesheet" href="${fontsKa}">` : `<link rel="stylesheet" href="${fontsKaName}">`}
<link rel="stylesheet" href="../assets/css/site.css">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>
<body class="lang-${lang}">
<canvas class="air" aria-hidden="true"></canvas>
<header class="mast">
  <div class="container mast-row">
    <nav class="mast-links" aria-label="NAIL LUXE">
      <a href="#prices">${esc(L.nav.prices)}</a>
      <a href="#visit">${esc(L.nav.visit)}</a>
      <a href="${esc(config.instagram || "#")}" ${config.instagram ? ext : 'data-pending="instagram"'}>Instagram</a>
    </nav>
    <a class="mast-mark" href="./" aria-label="NAIL LUXE"><img src="../assets/brand/wordmark.webp" width="1291" height="139" alt="NAIL LUXE"></a>
    <div class="mast-end">
      <nav class="langs" aria-label="${esc(L.nav.langs)}">${langNav}</nav>
      <a class="btn btn--small" href="${esc(fresha("studio"))}" ${freshaAttrs("studio")}>${esc(L.nav.book)}</a>
    </div>
  </div>
</header>

<main>
  <section class="hero air-zone">
    <div class="container hero-grid">
      <div class="hero-text">
        <h1>${esc(L.h1)}</h1>
        <p class="lead">${esc(L.lead)}</p>
        <div class="hero-actions">
          <a class="btn btn--primary" href="${esc(fresha("studio"))}" ${freshaAttrs("studio")}>${esc(L.bookOnline)}</a>
          <a class="btn" href="${esc(wa(owner.phone, L.waText))}" ${ext}>${esc(L.bookWhatsApp)}</a>
        </div>
      </div>
      <figure class="print stock">
        <img src="../assets/brand/monogram.webp" width="863" height="826" alt="NAIL LUXE" fetchpriority="high">
        <figcaption><span class="pencil" aria-hidden="true"></span>${esc(L.cardLabel)}</figcaption>
      </figure>
    </div>
  </section>

  <section class="prices" id="prices">
    <div class="container prices-grid">
      <div class="prices-head">
        <h2>${esc(L.pricesH)}</h2>
        <p class="lead">${esc(L.pricesLead)}</p>
        <div class="rail" aria-hidden="false">${strips}</div>
      </div>
      <table class="menu">
        <caption class="visually-hidden">${esc(L.pricesH)}</caption>
        <thead><tr><th scope="col">${esc(L.th[0])}</th><th scope="col" class="num">${esc(L.th[1])}</th><th scope="col" class="num">${esc(L.th[2])}</th></tr></thead>
      ${rows}
      </table>
    </div>
  </section>

  <section class="artists" id="artists">
    <div class="container">
      <div class="split-head">
        <h2>${esc(L.artistsH)}</h2>
        <p class="lead">${esc(L.artistsLead)}</p>
      </div>
      <div class="artist-grid">
      ${artistCards}
      </div>
    </div>
  </section>

  <section class="visit" id="visit">
    <div class="container visit-grid">
      <div>
        <h2>${esc(L.visitH)}</h2>
        <p class="address">${esc(L.address)}</p>
        <p><a class="link" href="${esc(config.maps)}" ${ext}>${esc(L.openMaps)}</a></p>
      </div>
      <dl class="ruled">
        ${L.rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("\n        ")}
      </dl>
    </div>
  </section>

</main>

<footer class="foot">
  <div class="container">
    <img class="foot-mark" src="../assets/brand/wordmark.webp" width="1291" height="139" alt="NAIL LUXE" loading="lazy">
    <div class="foot-row">
      <p>${esc(L.address)}</p>
      <p>${artists.map((a) => `<a href="tel:${a.phone}">${a.phoneShown}</a>`).join("<br>")}</p>
      <nav class="langs" aria-label="${esc(L.nav.langs)}">${langNav}</nav>
      ${config.instagram ? `<p><a href="${esc(config.instagram)}" ${ext}>Instagram</a></p>` : ""}
    </div>
    <p class="legal">© ${new Date().getFullYear()} NAIL LUXE, ${esc(L.footer)}</p>
  </div>
</footer>
<script src="../assets/js/air.js" defer></script>
</body>
</html>
`;
}

for (const lang of config.langs) {
  const dir = join(root, lang);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), page(lang));
}

// Root: send visitors to their language, Georgian by default.
writeFileSync(
  join(root, "index.html"),
  `<!doctype html>
<html lang="ka">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>NAIL LUXE</title>
<link rel="canonical" href="${config.siteUrl}/${config.defaultLang}/">
${config.langs.map((l) => `<link rel="alternate" hreflang="${l}" href="${config.siteUrl}/${l}/">`).join("\n")}
<link rel="alternate" hreflang="x-default" href="${config.siteUrl}/">
<link rel="icon" href="assets/brand/icon-32.png" sizes="32x32">
<script>
(function () {
  var langs = ${JSON.stringify(config.langs)}, pick = "${config.defaultLang}";
  var prefs = navigator.languages || [navigator.language || ""];
  for (var i = 0; i < prefs.length; i++) { var p = String(prefs[i]).slice(0, 2).toLowerCase(); if (langs.indexOf(p) > -1) { pick = p; break; } }
  location.replace(pick + "/");
})();
</script>
<style>body{font:16px/1.5 system-ui,sans-serif;margin:2rem}</style>
</head>
<body>
<p><a href="ka/">ქართული</a><br><a href="ru/">Русский</a><br><a href="en/">English</a></p>
</body>
</html>
`
);

writeFileSync(join(root, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${config.siteUrl}/sitemap.xml\n`);
writeFileSync(
  join(root, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${config.langs
  .map(
    (l) => `  <url><loc>${config.siteUrl}/${l}/</loc>
${config.langs.map((x) => `    <xhtml:link rel="alternate" hreflang="${x}" href="${config.siteUrl}/${x}/"/>`).join("\n")}
  </url>`
  )
  .join("\n")}
</urlset>
`
);
writeFileSync(join(root, ".nojekyll"), "");
console.log("built", config.langs.map((l) => `site/${l}/index.html`).join(", "));
