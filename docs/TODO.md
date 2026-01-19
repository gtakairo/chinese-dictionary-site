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
| GitHub Actions Deploy | `.github/workflows/deploy.yml` | S3 + CloudFront |

---

## 🔴 未完了：インフラ設定

### 1. AWSリソース作成

**必要なリソース:**
- S3バケット: `chinese-dictionary-site`
- CloudFront Distribution
- ACM証明書（カスタムドメイン使用時）

**手順:**
```bash
# 1. S3バケット作成
aws s3 mb s3://chinese-dictionary-site --region ap-northeast-1

# 2. 静的ウェブホスティング有効化
aws s3 website s3://chinese-dictionary-site \
  --index-document index.html \
  --error-document 404.html
```

### 2. GitHub Secrets設定

リポジトリの Settings > Secrets and variables > Actions で設定：

| Secret名 | 内容 |
|----------|------|
| `AWS_ACCESS_KEY_ID` | IAMユーザーのアクセスキー |
| `AWS_SECRET_ACCESS_KEY` | IAMユーザーのシークレットキー |
| `CLOUDFRONT_DISTRIBUTION_ID` | CloudFrontのディストリビューションID |

### 3. ドメイン設定

**選択肢:**
1. 新規ドメイン取得 → Route 53 or Cloudflare
2. 既存ドメインのサブドメイン使用

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
