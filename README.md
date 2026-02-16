# 🦎 Lizard — AI-Powered Tactical Patch Builder

An AI-first landing page for designing custom tactical patches. Chat with the Lizard AI assistant to describe your idea, then fine-tune it in the full configurator.

**[Live Demo →](https://dimaminka.github.io/mini-patch/)**

---

## Features

- **AI Chat Interface** — Describe your patch idea in natural language (mock AI for now)
- **Full Configurator** — Shape, material, size, color picker, image upload, and live canvas preview
- **Multi-language** — English, Russian, Hebrew (RTL supported)
- **Theme Toggle** — Light / Dark mode
- **Responsive** — Desktop and mobile layouts with a collapsible hamburger menu
- **CI/CD** — Auto-deploy to GitHub Pages via GitHub Actions

## Tech Stack

| Layer        | Technology                          |
|-------------|-------------------------------------|
| Framework   | Next.js 16 (App Router)             |
| Language    | TypeScript                          |
| Styling     | Tailwind CSS v4                     |
| UI          | shadcn/ui (Radix UI primitives)     |
| State       | Zustand (persisted)                 |
| Canvas      | Fabric.js                           |
| i18n        | next-intl                           |
| Theming     | next-themes                         |
| Deployment  | GitHub Pages (static export)        |

## Getting Started

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000/mini-patch](http://localhost:3000/mini-patch) in your browser.

## Build & Deploy

The project is configured for **static export** (`output: 'export'` in `next.config.ts`).

```bash
# Build static site into /out
npm run build
```

### GitHub Pages (Automatic)

Every push to `main` triggers the GitHub Actions workflow (`.github/workflows/deploy.yml`) which:

1. Installs dependencies (`npm ci`)
2. Builds the project (`npm run build`)
3. Creates a `404.html` for SPA client-side routing
4. Deploys the `/out` folder to the `gh-pages` branch

### Manual GitHub Setup (one-time)

1. Go to **Settings → Pages** in your GitHub repository
2. Set **Source** to "Deploy from a branch"
3. Set **Branch** to `gh-pages` / `/ (root)`

## Project Structure

```
src/
├── app/                    # Next.js App Router (layout, page, globals)
├── components/
│   ├── canvas/             # Fabric.js patch preview
│   ├── landing/            # HeroChat, ConfiguratorModal
│   ├── layout/             # AppHeader, ThemeToggle, LanguageSwitcher
│   ├── pricing/            # PriceDisplay, SubmitOrderButton
│   ├── sidebar/            # Shape, Material, Size, Color, Image selectors
│   ├── providers/          # ThemeProvider, LocaleProvider
│   └── ui/                 # shadcn/ui primitives (Button, Input, etc.)
├── lib/
│   ├── constants.ts        # Pricing, sizes, textures, defaults
│   ├── pricing/            # PriceCalculator
│   └── types/              # TypeScript interfaces
├── messages/               # i18n translations (en, ru, he)
└── stores/                 # Zustand state management
```

## License

MIT
