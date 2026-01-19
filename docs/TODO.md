# 未実装機能リスト

最終更新: 2026-01-19

## ✅ 実装完了

以下の機能は実装済みです：

| 機能 | ファイル | 備考 |
|------|----------|------|
| 検索機能 | `site/src/pages/[lang]/search.astro` | Fuse.js使用 |
| ブラウズページ | `site/src/pages/[lang]/browse.astro` | ピンイン順一覧 |
| タイ語対応 | `site/src/layouts/Layout.astro` | 言語スイッチャーに含む |
| 全カテゴリ動的生成 | `site/src/pages/[lang]/category/[category].astro` | getAllCategories()使用 |
| 多言語UIテキスト | `site/src/i18n/*.json` | en/ja/ko/th |
| OGP画像 | `site/public/og-default.svg` | デフォルト画像 |
| Sitemap | `astro.config.mjs` | @astrojs/sitemap |
| robots.txt | `site/public/robots.txt` | 設定済み |
| GitHub Actions CI | `.github/workflows/ci.yml` | lint, build |
| Cloudflare Pages | Cloudflareダッシュボード | 自動デプロイ設定済み |

**デプロイ済みURL:** https://chinese-dictionary-site.pages.dev/

---

## 🟠 オプション：カスタムドメイン設定

現在は `*.pages.dev` ドメインで公開中。カスタムドメインが必要な場合：

### 手順

1. **ドメイン取得**
   - Cloudflare Registrar（推奨）
   - 他のレジストラ（Namecheap, Google Domains等）

2. **Cloudflare Pagesでドメイン追加**
   - Cloudflareダッシュボード → Workers & Pages → chinese-dictionary-site
   - Custom domains → Add custom domain
   - ドメイン入力 → DNS設定が自動追加される

3. **robots.txt / sitemap更新**
   - `site/public/robots.txt` のSitemap URLを更新
   - `site/astro.config.mjs` の `site` 設定を更新

---

## 🟡 将来的な改善（優先度：低）

### 動的OG画像生成
- 各単語ごとにOG画像を自動生成
- `satori` または `@vercel/og` を使用

### サイドバーのカテゴリ動的化
- 現在 Layout.astro でハードコード（4カテゴリ）
- categories.json から動的に生成に変更

### ESLint警告の修正
- `site/src/lib/i18n.ts:28` の `any` 型を修正

---

## 📊 ビルド情報

- 総ページ数: 1,678ページ
- ビルド時間: 約14秒
- データ件数:
  - ja: 536件
  - en: 532件
  - ko: 534件
  - th: 528件
