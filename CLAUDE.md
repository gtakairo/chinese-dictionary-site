# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Multilingual Chinese dictionary site that scrapes word data from chineself.com (Japanese) and translates it to English, Korean, and Thai. Built with Astro SSG and hosted on Cloudflare Pages.

## Development Commands

### Astro Site (run from `site/` directory)
```bash
cd site
npm install        # Install dependencies
npm run dev        # Start dev server at localhost:4321
npm run build      # Build production site to ./dist/
npm run preview    # Preview production build
npm run lint       # Run ESLint
npm run lint:fix   # Fix ESLint errors
npm run format     # Format with Prettier
npm run format:check
```

### Data Scraping (run from project root)
```bash
npm install                              # Install playwright
node scripts/scrape.mjs                  # Scrape all words
node scripts/scrape.mjs --limit 100      # Scrape 100 words
node scripts/scrape.mjs --offset 500 --limit 100
```

### JSON Validation
```bash
node scripts/validate-json.mjs           # Validate all JSON in data/
```

## Architecture

```
chinese-dictionary-site/
├── data/                    # Word data as JSON files
│   ├── ja/                  # Source data (Japanese, scraped)
│   ├── en/                  # English translations
│   ├── ko/                  # Korean translations
│   ├── th/                  # Thai translations
│   └── _meta/               # categories.json, words-index.json
├── site/                    # Astro site
│   └── src/
│       ├── pages/[lang]/    # Dynamic language routes
│       ├── lib/data.ts      # Word data loading utilities
│       ├── lib/i18n.ts      # Translation helper (t function)
│       └── i18n/            # UI translation JSON files
├── scripts/                 # Utility scripts (scrape, validate, fix JSON)
└── docs/                    # Project documentation
```

## Data Schema

Word entries (`data/{lang}/{slug}.json`):
```typescript
interface WordEntry {
  slug: string;        // URL identifier (e.g., "tangping")
  chinese: string;     // Chinese characters (e.g., "躺平")
  pinyin: string;      // Romanization with tones
  meaning: string;     // Short definition
  category: string;    // Category slug (e.g., "net")
  etymology?: string;
  usage?: string;
  examples?: Array<{
    chinese: string;
    pinyin: string;
    translation: string;
  }>;
  related?: string[];
}
```

## Translation Workflow

- Japanese (`data/ja/`) is the source data (scraped from chineself.com)
- Translate `meaning`, `description`, and `examples[].translation` fields
- Keep `slug`, `chinese`, `pinyin`, `category`, `relatedWords` unchanged
- Output to `data/{en,ko,th}/{slug}.json`

## Key Patterns

- **Routing**: Language-based routing via `[lang]/` dynamic segment
- **Data Loading**: `getAllWords(lang)`, `getWordBySlug(lang, slug)` from `site/src/lib/data.ts`
- **i18n**: Use `t(lang, 'key.path')` for UI translations, JSON files in `site/src/i18n/`
- **Categories**: Defined in `data/_meta/categories.json` with multilingual names

## CI/CD

- `ci.yml`: Runs lint, format check, and build on PRs and main pushes
- Deploy is handled automatically by Cloudflare Pages on push to main
