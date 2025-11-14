# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Amigos do Céu" is a contemplative gallery website showcasing Catholic saints with images and stories. Built with Next.js 14, React 18, Tailwind CSS, and Framer Motion.

## Development Commands

- `npm install` - Install dependencies
- `npm run dev` - Start development server at http://localhost:3000
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run Next.js linter

## Architecture

### Data-Driven Content
The application is driven by a single JSON data source at `data/santos.json`. Each saint entry contains:
- `nome` - Saint's name
- `slug` - URL-friendly identifier
- `imagem` - Path to image in `/public/images/`
- `descricao` - Biography/description
- `oracao` - Prayer text
- `tags` - Array of categorical tags

### Routing Structure
- `/` (pages/index.js) - Home page with highlights
- `/santos/[slug]` (pages/santos/[slug].js) - Dynamic saint detail pages using Next.js dynamic routes

### Component Architecture
- **Layout** (components/Layout.js) - Shared page wrapper with header, navigation, and footer
- **Gallery** (components/Gallery.js) - Grid display of saint cards
- **SaintCard** (components/SaintCard.js) - Individual saint preview card with hover effects

### Styling System
- Custom Tailwind configuration with `parchment` color theme (#f7f3ee)
- Typography: Inter (body) and Playfair Display (headings - loaded via font-family in CSS)
- Tailwind content paths: `pages/**/*.{js,jsx}` and `components/**/*.{js,jsx}`
- Custom CSS classes in `styles/globals.css` (e.g., `.img-hero` for saint detail images)

### Animation
Framer Motion is used for page transitions and interactions, primarily in the saint detail pages with fade-in and slide-up animations.

## Adding New Saints

To add a new saint:
1. Add the saint's image to `/public/images/`
2. Add a new entry to `data/santos.json` with all required fields
3. Ensure the `slug` is unique and URL-safe
4. The dynamic route will automatically generate the page at `/santos/[slug]`
- Lembresse de utilizar o Wikimedia Image Fetcher sempre que precisar procurar imagens de novos santos ou igrejas