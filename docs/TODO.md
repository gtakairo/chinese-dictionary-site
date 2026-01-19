# 開発状況

最終更新: 2026-01-19

## ✅ 実装完了

| 機能 | ファイル | 備考 |
|------|----------|------|
| 検索機能 | `site/src/pages/[lang]/search.astro` | Fuse.js使用 |
| ブラウズページ | `site/src/pages/[lang]/browse.astro` | ピンイン順一覧 |
| 4言語対応 | `site/src/layouts/Layout.astro` | en/ja/ko/th |
| 全カテゴリ動的生成 | `site/src/pages/[lang]/category/[category].astro` | 29カテゴリ |
| サイドバー動的化 | `site/src/layouts/Layout.astro` | categories.jsonから生成 |
| 多言語UIテキスト | `site/src/i18n/*.json` | en/ja/ko/th |
| OGP画像 | `site/public/og-default.svg` | デフォルト画像 |
| Sitemap | `astro.config.mjs` | @astrojs/sitemap |
| robots.txt | `site/public/robots.txt` | 設定済み |
| GitHub Actions CI | `.github/workflows/ci.yml` | lint, format, build（厳格モード） |
| Cloudflare Pages | Cloudflareダッシュボード | 自動デプロイ設定済み |
| ESLint/Prettier | `eslint.config.mjs` | TypeScript + Astro対応 |

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

3. **コード内のURL更新**（一括置換: `chinesedict.com` → 新ドメイン）
   - `site/astro.config.mjs:9` - site設定
   - `site/public/robots.txt:5` - Sitemap URL
   - `site/src/layouts/Layout.astro:26-27, 79-99` - OG/hreflang URLs

---

## 🟡 将来的な改善（優先度：低）

| 項目 | 内容 |
|------|------|
| 動的OG画像生成 | 各単語ごとにOG画像を自動生成（satori使用） |

---

## 📊 ビルド情報

- 総ページ数: **2,237ページ**
- ビルド時間: 約40秒
- カテゴリ数: 29
- データ件数: 約530件/言語 × 4言語
