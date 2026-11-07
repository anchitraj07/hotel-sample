# Hôtel Hermitage Monte-Carlo — Luxury Palace Website Template

A bespoke, responsive, and interactive luxury hotel web template inspired by the official **Hôtel Hermitage Monte-Carlo** website by **Monte-Carlo Société des Bains de Mer (SBM)**:  
`https://www.montecarlosbm.com/en/hotel-monaco/hotel-hermitage-monte-carlo`

---

## 🏛️ Project Overview

This template captures the Belle Époque heritage, discreet luxury, and Monaco palace atmosphere of the historic Hôtel Hermitage Monte-Carlo. It features the distinctive visual language of Monte-Carlo SBM: warm champagne golds, deep midnight blues, classic Roman serif typography (*Cinzel* & *Cormorant Garamond*), and modern interactive guest experiences.

### Key Highlights
- **Resort Umbrella Navigation**: Monte-Carlo SBM brand identity with resort dropdowns, language selectors, and multi-currency conversion.
- **Cinematic Hero Carousel**: Full-screen slide transitions highlighting the palace facade, Mediterranean harbor views, luxury suites, and Thermes Marins seawater spa.
- **Interactive Booking Bar & Drawer**:
  - Live check-in/check-out date calculation.
  - Interactive guest & room counter picker (+ / -).
  - Multi-step checkout drawer with room selection, rate plans (Flexible vs Bed & Breakfast), and curated palace enhancements (Dom Pérignon, Nice Airport Helicopter transfer, Thermes Marins spa ritual).
  - Dynamic price conversion across **EUR (€)**, **USD ($)**, **GBP (£)**, and **CHF**.
  - Instant simulated reservation confirmation with unique reference code.
- **Rooms & Diamond Suites Showcase**:
  - Filterable by *Superior*, *Deluxe*, *Junior Suites*, and *Diamond Suites*.
  - Full specifications modal with surface area in m² and sq ft, bed configurations, view orientations, and luxury Hermès amenities.
- **Haute Gastronomy by Yannick Alléno**:
  - Pavyllon Monte-Carlo (1 Michelin Star ★) feature with seasonal tasting menu.
  - L'Abysse Monte-Carlo (Japanese omakase counter).
  - Crystal Bar & Lounge (vintage champagne & cigar garden).
  - Le Limùn (Belle Époque tea room).
  - Interactive table reservation modal.
- **Thermes Marins Monte-Carlo**:
  - Direct access showcase to the 7,500 m² seawater wellness haven, -110°C cryotherapy, and Thalassotherapy rituals.
- **Monaco Experiences & Privileges**:
  - Cercle Monte-Carlo passport benefits: Casino de Monte-Carlo entry, resort shuttles, and single billing.
  - Monaco Grand Prix VIP terrace and yacht charter packages.
- **Palace Photo Lightbox**:
  - Interactive modal with next/previous controls and full-screen preview.

---

## 📁 File Structure

```
sample website for hotel/
├── index.html          # Flagship palace landing page & complete interactive experience
├── rooms.html          # Accommodations catalog with filterable room types & comparison
├── dining.html         # Gastronomy page featuring Yannick Alléno, menus & table booking
├── wellness.html       # Thermes Marins Monte-Carlo spa, seawater pool & cryotherapy
├── offers.html         # Exclusive seasonal packages & VIP weekend experiences
├── contact.html        # Clefs d'Or concierge, helicopter/valet arrival & event inquiries
├── css/
│   └── style.css       # Haute-couture CSS stylesheet with variables, animations & responsive grid
├── js/
│   └── main.js         # Interactive booking engine, currency switcher, modal & lightbox logic
└── README.md           # Documentation & design reference
```

---

## 🚀 How to View & Test

You can preview the website immediately in any modern web browser:

1. **Direct Browser Open**:
   - Double-click on `index.html` in this folder to open it in your default browser (Google Chrome, Edge, Safari, Firefox).
   - All links between `index.html`, `rooms.html`, `dining.html`, `wellness.html`, `offers.html`, and `contact.html` work seamlessly offline without requiring a web server.

2. **Local HTTP Server (Optional)**:
   If you prefer serving via localhost:
   ```powershell
   # Using Python
   python -m http.server 8000
   # Then visit: http://localhost:8000

   # Or using Node.js npx
   npx serve .
   ```

---

## 🎨 Design Tokens & Palette

| Token | Value | Description |
|---|---|---|
| `--gold-primary` | `#c5a467` | Signature Monte-Carlo metallic gold |
| `--gold-light` | `#dfc285` | Champagne highlight accent |
| `--gold-dark` | `#9f7d3e` | Deep antique gold for badges & labels |
| `--color-primary` | `#0f1622` | Deep Mediterranean navy & slate black |
| `--bg-body` | `#faf8f5` | Warm Belle Époque alabaster & linen |
| `--font-serif` | `'Cormorant Garamond'` | Classic palace typography |
| `--font-display`| `'Cinzel'` | Luxury Roman serif for headers & branding |
| `--font-sans` | `'Plus Jakarta Sans'` | Clean, high-legibility modern sans-serif |

---

## 📱 Responsive & Mobile-Ready

The layout is fully responsive with customized breakpoints for desktops, tablets, and smartphones, including a slide-out mobile drawer menu and touch-friendly booking controls.
