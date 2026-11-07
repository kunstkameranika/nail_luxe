# Nail Luxe

Website for NAIL LUXE, a nail studio at 4B Petre Iberi St, Tbilisi. It is a one-page site in Georgian (`/ka/`), Russian (`/ru/`) and English (`/en/`).

- [PLAN.md](PLAN.md): what we are building and in what order
- [QUESTIONS.md](QUESTIONS.md) / [BRIEF.md](BRIEF.md): questions and the answers received
- Task list: https://claude.ai/artifact/WhdSbdU95rPg2G9QWEiYbG (source in `tasks/`)
- Design skill: Hallmark, in `.claude/skills/hallmark` (from github.com/Nutlope/hallmark, MIT)

## How the site is made

- `src/content.mjs`: **all text, prices, phone numbers and links**, in all three languages. Edit this file.
- `src/build.mjs`: turns the content into `site/ka/`, `site/ru/`, `site/en/`, plus `site/index.html` (sends visitors to their language, Georgian by default), `sitemap.xml` and `robots.txt`.
- `site/assets/`: styles (`css/`), the background animation (`js/air.js`) and the logos (`brand/`).

After any change to the content:

```bash
node src/build.mjs
```

To preview: `npx serve site` (or any static server), then open `/en/`.

## Booking buttons (Fresha)

Paste the three Fresha links (Fresha → Link builder) into `config.fresha` in `src/content.mjs` and rebuild. Until then every booking button opens WhatsApp with a ready-made message: studio and "any artist" go to Nata, and each artist's button goes to that artist.

## Publishing

`.github/workflows/pages.yml` builds and publishes `site/` to GitHub Pages on every push to `main`. You turn it on once in the repo: Settings → Pages → Source: **GitHub Actions**. When the domain is bought, set `config.siteUrl` to it and add the domain under Settings → Pages.
