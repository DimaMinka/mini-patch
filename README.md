# 🦎 Lizard — AI-Powered Tactical Patch Builder

An AI-first landing page for designing custom tactical patches. Chat with the Lizard AI assistant to describe your idea, then fine-tune it in the full configurator.

**[Live Demo →](https://dimaminka.github.io/mini-patch/)**

---

## Features

- **Gemini-Powered Semantic Search** — Search for patches using natural language (e.g., "Tactical unit patches" or "Medical team"). Uses vector embeddings for high-precision discovery.
- **Smart Input Filter** — Localized (EN, RU, HE) chat filtering to catch casual conversation and profanity instantly, saving backend tokens.
- **Product Discovery** — Paginated browsing of patch collections with instant "Load More" functionality.
- **Seamless Constructor Integration** — Found a patch you like? Click "Order Now" to auto-load the design and shape directly into the configurator.
- **Full Configurator** — Real-time customization of Shape, Material, Size, Colors, and Custom Images with a Fabric.js canvas preview.
- **Premium Aesthetics** — Vibrant glassmorphism design, pulse/shine animations, and dark/light mode support.
- **Localization** — Full support for English, Russian, and Hebrew (RTL).

## Tech Stack

| Layer        | Technology                                      |
|-------------|-------------------------------------------------|
| **Frontend** | Next.js 15 (App Router), TypeScript            |
| **Styling**  | Tailwind CSS v4, Lucide Icons                   |
| **AI / NLP** | Google Gemini (Embeddings), Vercel AI SDK      |
| **Database** | Supabase (PostgreSQL + pgvector)                |
| **State**    | Zustand (with persistence)                      |
| **Graphics** | Fabric.js (Canvas)                              |
| **i18n**     | next-intl (EN, RU, HE)                          |
| **Deployment**| GitHub Pages (static export)                    |

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
│   ├── chat/               # Smart input filtering & token optimization
│   ├── constants.ts        # Pricing, sizes, textures, defaults
│   ├── pricing/            # PriceCalculator
│   └── types/              # TypeScript interfaces
├── messages/               # i18n translations (en, ru, he)
└── stores/                 # Zustand state management
```

## License

MIT
