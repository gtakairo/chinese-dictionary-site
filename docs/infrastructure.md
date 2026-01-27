# インフラ・デプロイ

## 概要

| 項目 | 内容 |
|------|------|
| ホスティング | Cloudflare Pages |
| コスト | 無料（帯域無制限） |
| CDN | Cloudflare グローバルCDN |
| CI/CD | GitHub Actions + Cloudflare Pages 自動デプロイ |

---

## 1. Cloudflare Pages 構成

```
┌─────────────────────────────────────────────────────┐
│               Cloudflare Pages (CDN / HTTPS)         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │
│  │ /en/*    │ │ /ko/*    │ │ /th/*    │ │ /ja/*  │ │
│  └──────────┘ └──────────┘ └──────────┘ └────────┘ │
└─────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────┐
│              GitHub リポジトリ (main)                 │
│            push → 自動ビルド・デプロイ                 │
└─────────────────────────────────────────────────────┘
```

## 2. セットアップ

1. Cloudflare アカウント作成
2. Pages プロジェクト作成
3. GitHub リポジトリ連携
4. ビルド設定:
   - **Framework preset**: Astro
   - **Build command**: `cd site && npm run build`
   - **Build output directory**: `site/dist`
   - **Node.js version**: 20

## 3. デプロイ

- **自動デプロイ**: `main` ブランチへの push で自動ビルド・デプロイ
- **プレビューデプロイ**: PR ごとにプレビュー URL が自動生成
- **現在のURL**: `chinese-dictionary-site.pages.dev`

## 4. ドメイン設定

### カスタムドメイン追加手順

1. Cloudflare Pages > プロジェクト > Custom domains
2. ドメインを追加
3. DNS レコードが自動設定される（Cloudflare DNS 利用時）

### DNS 設定（Cloudflare DNS 以外の場合）

```
Type: CNAME
Name: www (または @)
Target: chinese-dic.org
```

## 5. CI/CD

### GitHub Actions (`ci.yml`)

PR と `main` push 時に自動実行:
- ESLint チェック
- Prettier フォーマットチェック
- Astro ビルド
- ビルドサイズ確認

デプロイ自体は Cloudflare Pages の GitHub 連携で自動実行されるため、
別途 deploy ワークフローは不要。
