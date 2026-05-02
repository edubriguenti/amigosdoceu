# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Amigos do Céu" is a Catholic faith portal showcasing saints, churches, Marian apparitions, the liturgical calendar, prayers/novenas/rosary, the Life of Christ, and an interactive Bible Connections section (`/conexoes`) that gamifies the discovery of Old↔New Testament parallels. Built with Next.js 14, React 18, Tailwind CSS, Framer Motion, and Leaflet for interactive maps. Fully static (no `pages/api/`) — all user state persists via `localStorage`.

## Development Commands

- `npm install` - Install dependencies
- `npm run dev` - Start development server at http://localhost:3000
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run Next.js linter

## Git Workflow

**IMPORTANT: Always create a new branch before making changes.**

### Branch Naming Conventions

- **Features**: `feature/short-description` (e.g., `feature/dark-mode`)
- **Bug fixes**: `fix/short-description` (e.g., `fix/sitemap-google-console`)
- **Improvements**: `improve/short-description` (e.g., `improve/performance`)
- **Refactoring**: `refactor/short-description` (e.g., `refactor/search-utils`)

### Workflow Steps

1. **Create a new branch** from main:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** and commit with descriptive messages

3. **Push the branch** to remote:
   ```bash
   git push -u origin feature/your-feature-name
   ```

4. **Create a Pull Request** on GitHub for review

5. **Merge to main** after review/testing

### Never Work Directly on Main

Always use feature branches to:
- Keep main branch stable and deployable
- Enable easier code review
- Allow rollback if issues arise
- Facilitate parallel development

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

- **`data/conexoes/`** - Bible Connections (split for scalability):
  - `eventos.json` — 7 timeline events (Criação, Aliança, Lei, Profetas, Jesus, Igreja, Eternidade)
  - `trilhas.json` — Themed trails (O Messias Prometido, Sacrifício e Redenção, etc.)
  - `desafios.json` — Daily quiz items (selected deterministically by date hash)
  - `conexoes/<trilha-slug>.json` — Connections per trail with `antigoTestamento` / `novoTestamento` pairs, `tema`, `eventoId`, `trilhaId`, `explicacao`
  - All aggregation goes through `lib/conexoesData.js`

### Routing Structure
- `/` - Modernized home: 4 large hero buttons (Vida de Cristo, Santos, Igrejas, Orações) + "Explore também" grid with 9 secondary cards. **Renders without the global header** (`<Layout hideHeader fullBleed>`).
- `/santos` - Saints gallery with search/filter
- `/santos/[slug]` - Individual saint detail page
- `/igrejas` - Churches gallery with search/filter
- `/igrejas/[slug]` - Individual church detail page
- `/aparicoes` - Marian apparitions gallery
- `/aparicoes/[slug]` - Individual apparition detail page
- `/santos-do-dia` - Saints celebrated today
- `/calendario` - Full liturgical calendar view
- `/mapa` - Interactive map showing churches and apparition locations
- `/vida-de-cristo` - Visual timeline of Christ's life
- `/oracoes`, `/oracoes/[slug]` - Prayers
- `/novenas`, `/novenas/[slug]` - Novenas
- `/rosario` - Rosary (mysteries, meditations)
- `/album-sagrado`, `/album-sagrado/[colecaoId]` - Interactive saints album
- `/conexoes` - **Bible Connections** (immersive dark theme, Phase 1): hero, interactive timeline, AT↔NT featured pair, daily quiz, XP/level/streak progress, themed trails. Deep-link via `?ref=<conexao-slug>`. See "Conexões da Bíblia" section below.
- `/intencoes`, `/favoritos` - Personal areas

All detail pages use Next.js dynamic routes with the `[slug]` pattern.

### Component Architecture

**Layout Components:**
- `Layout.js` - Page wrapper. Accepts `hideHeader` (omit header entirely — used by `/`) and `fullBleed` (drop the `container mx-auto` constraint so the page can render edge-to-edge). Defaults preserve old behavior for internal pages.
- `MinimalHeader.js` - Default header on internal pages: a thin sticky bar with only `← Amigos do Céu` (link back to home). Replaces the previous full nav per UX direction.
- `Header.js` - Legacy full navigation (currently unused; kept for reference / quick rollback).
- `Footer.js` - Site footer
- `SEO.js` - Meta tags, Open Graph, Twitter Cards, JSON-LD. Use this on every new page (not raw `<Head>`).
- `HomeHeroButton.js`, `HomeSecondaryCard.js` - Building blocks of the modernized home.

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

**Conexões da Bíblia (`components/conexoes/`):**
- `HeroConexoes.js` — Cinematic hero (3 layers + parallax + central glow + premium CTA).
- `TimelineInterativa.js` — Horizontal timeline of 7 events; keyboard nav (arrows / Home / End); mobile snap-scroll with `scrollIntoView`.
- `ConexaoEmDestaque.js` — Featured AT↔NT pair carousel; `AnimatePresence` crossfade between connections; pulsing central symbol.
- `LinhaLuminosa.js` — Hero effect: SVG gradient line (azul→dourado) with `stroke-dasharray` flow + opacity pulse; `intense` prop on hover.
- `ExplicacaoConexao.js` — Explanation block + TTS button (hidden if unsupported) + "Estudar mais".
- `DesafioDoDia.js` — Daily quiz with soft-shake on wrong, green glow on correct, deterministic per date.
- `ProgressoUsuario.js` — XP bar, level title (Peregrino → Buscador → Discípulo → Guardião), streak, discoveries.
- `TrilhasGrid.js` + `TrilhaCard.js` (memoized) — Themed trails grid with per-trail progress bar.
- `BeneficiosFooter.js`, `DescobertaToast.js`, `ParticulasHero.js`, `EmptyState.js`, `Skeleton.js` — Supporting UI.

### Utility Functions (`lib/`)

**`lib/searchUtils.js`** - Core search and filtering logic:
- `normalizeText()` - Removes accents and normalizes text for fuzzy search
- `searchSaints()` / `searchChurches()` - Accent-insensitive search across multiple fields
- `filterSaints()` / `filterChurches()` - Multi-criteria filtering (countries, tags, periods, orders, architectural styles)
- `sortSaints()` / `sortChurches()` - Sorting by name, date, popularity, capacity
- `getUniqueValues()` - Extracts unique filter options from data

**`lib/calendarUtils.js`** - Liturgical calendar utilities

**`lib/conexoesData.js`** - Aggregation layer for `data/conexoes/`:
- `getEventos()`, `getTrilhas()`, `getAllConexoes()`
- `getConexaoBySlug(slug)`, `getConexoesByEvento(id)`, `getConexoesByTrilha(id)`
- `getDesafioDoDia(date)` — picks daily challenge via deterministic full-date hash (stable per day, not just `getDate() % len`)

### Hooks (`hooks/`)

- `useFavoritos.js` — localStorage CRUD for favorites and lists (santos/igrejas/aparições). Exposes `loaded` to gate hydration.
- `useProgresso.js` — Conexões progress (XP, level, title-by-tier, daily streak, discovered connections, completed trails, daily challenges). Storage key: `amigos-do-ceu:progresso-conexoes`. XP rules: +10 first-view, +25 correct quiz, +50 trail completion. Streak increments only when previous activity was yesterday.
- `useTTS.js` — Web Speech API wrapper: `{ isSupported, isSpeaking, speak(text), stop() }`. Cancels previous utterance and on unmount. UI must hide controls when `!isSupported`.
- All localStorage hooks wait for `loaded` to avoid SSR/hydration mismatches.

### Contexts (`contexts/`)

- `ConexoesContext.js` — Lightweight provider for the `/conexoes` page. Wraps `useProgresso` + `useTTS`, manages `eventoAtivo`/`conexaoAtiva`/`descobertaRecente`, handles deep-linking via `?ref=<slug>` (read on mount, written via `router.replace shallow` on selection), triggers the "Conexão descoberta" toast on first view of a connection. Components consume via `useConexoes()`.

### Styling System

**Tailwind Configuration (`tailwind.config.cjs`):**
- Extended color palette with accessible WCAG 2.1 AA/AAA compliant colors:
  - `parchment` (#f7f3ee) - Legacy background color
  - `primary` - Neutral tones (50-300)
  - `accent` - Blue Marian theme for CTAs (50-800)
  - `secondary` - Gold/amber liturgical theme (50-600)
  - `neutral` - High-contrast text colors (50-900)
  - `cosmic` - **Dark theme used ONLY in `/conexoes`**: `bg`, `surface`, `surface-2`, `border`, `blue`, `blue-light`, `gold`, `purple`, `glow`. Do not leak into other pages.
- Custom keyframes/animations for the cosmic theme: `pulse-glow`, `flow-line`, `pulse-scale`, `shake-soft` (used by hero line, central symbol, quiz error feedback). All performance-safe (transform/opacity only).
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

### Adding a Bible Connection
1. Pick the trail (`messias-prometido`, `sacrificio-redencao`, `reino-deus`, `lei-graca`) and append the new connection object to `data/conexoes/conexoes/<trail>.json`. Required fields: `id`, `slug`, `tema`, `trilhaId`, `eventoId`, `antigoTestamento` ({ referencia, texto }), `novoTestamento` (same), `explicacao`.
2. `imagem` per side is optional — the card falls back to a thematic gradient.
3. To add a daily quiz item: append to `data/conexoes/desafios.json` with `versiculoNT`, three `alternativas` (one with `correta: true`), and `explicacao`. Selection rotates daily via date-hash.
4. To add a new trail: append to `data/conexoes/trilhas.json` AND create the matching `data/conexoes/conexoes/<slug>.json` AND import it in `lib/conexoesData.js` (`TODAS_CONEXOES` array).

## SEO

- Every page must use the `<SEO>` component (not raw `<Head>`). Pass `title`, `description`, `url`, optional `keywords` and `structuredData` (JSON-LD).
- The home and `/conexoes` ship `WebSite` and `LearningResource` schemas respectively.
- Sitemap is generated dynamically by `pages/sitemap.xml.js` from `data/*.json`. **When adding a new top-level static page, also add it to the `staticPages` array there** (priority + changefreq).