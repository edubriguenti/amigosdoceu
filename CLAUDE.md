# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Amigos do Céu" is a Catholic faith portal showcasing saints, churches, Marian apparitions, and liturgical calendar. Built with Next.js 14, React 18, Tailwind CSS, Framer Motion, and Leaflet for interactive maps.

## Development Commands

- `npm install` - Install dependencies
- `npm run dev` - Start development server at http://localhost:3000
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run Next.js linter

## Architecture

### Data-Driven Content
The application is driven by multiple JSON data sources in the `data/` directory:

- **`santos.json`** - Saints database with fields:
  - Core: `nome`, `slug`, `imagem`, `descricao`, `oracao`, `tags`
  - Metadata: `dataNascimento`, `dataFalecimento`, `dataCanonizacao`, `pais`, `ordemReligiosa`, `padroeiro[]`, `periodo`, `doutorIgreja`, `popularidade`

- **`igrejas.json`** - Churches/basilicas with fields:
  - Core: `nome`, `local`, `slug`, `imagem`, `descricao`
  - Metadata: `ano`, `arquiteto`, `importancia`, `pais`, `cidade`, `estiloArquitetonico`, `tipo`, `capacidade`, `latitude`, `longitude`, `tags[]`

- **`aparicoes.json`** - Marian apparitions with fields:
  - Core: `nome`, `slug`, `imagem`, `local`, `data`, `historia`
  - Location: `latitude`, `longitude`, `linkGoogleMaps`, `tags[]`

- **`calendario-liturgico.json`** - Liturgical calendar with daily celebrations

### Routing Structure
- `/` - Home page with section links (Santos, Igrejas, Aparições, Calendário)
- `/santos` - Saints gallery with search/filter
- `/santos/[slug]` - Individual saint detail page
- `/igrejas` - Churches gallery with search/filter
- `/igrejas/[slug]` - Individual church detail page
- `/aparicoes` - Marian apparitions gallery
- `/aparicoes/[slug]` - Individual apparition detail page
- `/santos-do-dia` - Saints celebrated today
- `/calendario` - Full liturgical calendar view
- `/mapa` - Interactive map showing churches and apparition locations

All detail pages use Next.js dynamic routes with the `[slug]` pattern.

### Component Architecture

**Layout Components:**
- `Layout.js` - Page wrapper with Header, Footer, and SEO
- `Header.js` - Navigation bar with search functionality
- `Footer.js` - Site footer
- `SEO.js` - Meta tags and Open Graph configuration

**Content Display:**
- `Gallery.js` / `SaintCard.js` - Saints grid and cards
- `ChurchGallery.js` / `ChurchCard.js` - Churches grid and cards
- `AparicaoCard.js` - Apparition cards
- `SearchBar.js` / `SearchResults.js` - Search functionality
- `FilterPanel.js` - Advanced filtering UI

**Interactive Features:**
- `MapaInterativo.js` - Leaflet-based map with markers (uses react-leaflet)
- `CalendarioMensal.js` - Monthly liturgical calendar view
- `NotificacoesLiturgicas.js` - Liturgical notifications

**Utilities:**
- `Button.js` - Reusable button component

### Utility Functions (`lib/`)

**`lib/searchUtils.js`** - Core search and filtering logic:
- `normalizeText()` - Removes accents and normalizes text for fuzzy search
- `searchSaints()` / `searchChurches()` - Accent-insensitive search across multiple fields
- `filterSaints()` / `filterChurches()` - Multi-criteria filtering (countries, tags, periods, orders, architectural styles)
- `sortSaints()` / `sortChurches()` - Sorting by name, date, popularity, capacity
- `getUniqueValues()` - Extracts unique filter options from data

**`lib/calendarUtils.js`** - Liturgical calendar utilities

### Styling System

**Tailwind Configuration (`tailwind.config.cjs`):**
- Extended color palette with accessible WCAG 2.1 AA/AAA compliant colors:
  - `parchment` (#f7f3ee) - Legacy background color
  - `primary` - Neutral tones (50-300)
  - `accent` - Blue Marian theme for CTAs (50-800)
  - `secondary` - Gold/amber liturgical theme (50-600)
  - `neutral` - High-contrast text colors (50-900)
- Typography: Inter (sans), Playfair Display (serif)
- Content paths: `pages/**/*.{js,jsx}` and `components/**/*.{js,jsx}`
- Custom spacing values (18, 88, 100)

**Global Styles (`styles/globals.css`):**
- Custom CSS classes like `.img-hero` for detail page images
- CSS variable definitions

### Animation & Interactivity

- **Framer Motion**: Page transitions with fade-in and slide-up animations in detail pages
- **Leaflet/React-Leaflet**: Interactive maps showing church and apparition locations with coordinates from JSON data

### Image Configuration

**`next.config.js`** includes image domain allowlist:
- `upload.wikimedia.org` - For Wikimedia Commons images used in churches

## Adding New Content

### Adding a Saint
1. Add image to `/public/images/` (or use Wikimedia Image Fetcher)
2. Add entry to `data/santos.json` with all required fields
3. Ensure `slug` is unique and URL-safe
4. Dynamic route automatically generates `/santos/[slug]` page

### Adding a Church
1. Find Wikimedia Commons image or add to `/public/images/`
2. Add entry to `data/igrejas.json` with coordinates for map display
3. Ensure `slug` is unique
4. Church appears in gallery and map automatically

### Adding an Apparition
1. Add entry to `data/aparicoes.json` with location coordinates
2. Include `linkGoogleMaps` for external navigation
3. Location markers automatically appear on `/mapa`

### Image Resources
- Use Wikimedia Image Fetcher skill when searching for images of new saints or churches
- Wikimedia Commons is the preferred source for historical/religious imagery