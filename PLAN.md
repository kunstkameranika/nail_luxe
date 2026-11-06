# Nail Luxe — Website Plan

Nail studio in Tbilisi, Georgia — 4B Petre Iberi St, T'bilisi 0159.
Two nail artists (the owner and her friend). Instagram is being set up.
No domain bought yet (candidate: `nailluxe.ge`).

Status: **planning**. Nothing is built yet. Open questions are in [QUESTIONS.md](QUESTIONS.md).

---

## 1. Booking system

### SumUp: probably not available in Georgia
SumUp Bookings is sold in the European countries where SumUp operates, and Georgia
is not on any list of them we found. SumUp also needs a business registered in a
supported country. **Check:** the owner tries signing up with her Georgian details.
If that fails, SumUp is out.

### Options

| | Fresha | Cal.com (open source) | Easy!Appointments (open source) | Altegio |
|---|---|---|---|---|
| Cost | Basic plan free | Self-hosted free, server about $5–10 a month; hosted plan priced separately | Cheap PHP hosting, a few $ a month | Paid |
| Separate calendar per artist | Yes | Yes | Yes | Yes |
| Calendar sync | Own app | Google, Apple, Outlook | Google, CalDAV | Own app |
| Automatic reminders | Yes | Email, SMS, WhatsApp built in (SMS/WhatsApp go through Twilio and are charged per message) | Email confirmations only; reminders look like a paid add-on | Yes |
| Mobile app | Yes, for staff and clients | Phone browser; bookings land in each artist's phone calendar | Phone browser only | Yes |
| Languages | Many | Many incl. Russian; Georgian not confirmed | Few; RU/KA not confirmed | Russian interface |
| Already used in Tbilisi | Yes | — | — | — |

**Recommendation:**
- If nobody wants to run a server: **Fresha**. It's free, already used by Tbilisi salons, and has an app.
- If we want open source: **Cal.com**. It's the only open-source option with built-in reminders.
- Card payments in the studio can go through a TBC or Bank of Georgia terminal either way.

Note: a booking system can't run on GitHub Pages, which only serves static
files. The website links to or embeds the booking tool, and the tool is hosted elsewhere.

---

## 2. Website

### Pages
1. **Home**: hero photo, short intro, "Book now", highlights
2. **Services & prices**: GEL prices and how long each service takes
3. **Gallery**: photos of their work
4. **Artists**: one page per artist, with photo, bio, specialities and a "Book with …" button
5. **Booking**: embedded booking widget or link
6. **Contact**: address, map, hours, how to find the entrance

### Languages
- Georgian (`/ka/`), Russian (`/ru/`), English (`/en/`), each at its own URL
- `hreflang` tags so Google shows the right language
- Fonts that cover Georgian, Cyrillic and Latin (e.g. Noto Sans Georgian + a Latin/Cyrillic display font)
- Language switcher on every page

### Features
- One-tap buttons to call, WhatsApp and Instagram, built mobile-first since most visitors arrive from Instagram on a phone
- Embedded Google Map
- Basic SEO: titles, descriptions, `LocalBusiness` structured data, sitemap
- Fast loading: optimised images, no heavy framework

### Tech & hosting
- Static site (plain HTML/CSS or a light static generator)
- Free hosting: GitHub Pages or Cloudflare Pages, which publish automatically on every push
- Domain bought later, then pointed at the host

---

## 3. Outside the website
- **Google Business Profile**: the most important for "nail salon near me" searches
- **2GIS** and **Yandex Maps** listings, which are widely used in Tbilisi
- Instagram bio link pointing at the site and the booking page

---

## 4. Order of work
1. Owner answers [QUESTIONS.md](QUESTIONS.md); check whether SumUp works in Georgia
2. Choose the booking tool (Fresha / Cal.com / other)
3. Design draft of the homepage, then approval
4. Build all pages in English, then add the Georgian and Russian texts and have them proofread
5. Connect booking, map and contact buttons
6. Publish on GitHub Pages / Cloudflare and test on phones
7. Buy the domain and connect it
8. Google Business Profile, 2GIS, Yandex Maps

## 5. Maintenance
Changes (prices, photos, texts) are made in this repository, either by hand or by
asking Claude Code in a session with this repo. The host republishes automatically
after each push.
