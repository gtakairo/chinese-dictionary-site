# インフラ・デプロイ

## 概要

| 項目 | 内容 |
|------|------|
| 推奨構成 | S3 + CloudFront |
| 月額コスト | $1-5 |
| 代替案 | Cloudflare Pages（無料） |
| CI/CD | GitHub Actions |

---

## 1. S3 + CloudFront 構成

```
┌─────────────────────────────────────────────────────┐
│                    CloudFront                        │
│                 (CDN / HTTPS)                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │
│  │ /en/*    │ │ /ko/*    │ │ /th/*    │ │ /ja/*  │ │
│  └──────────┘ └──────────┘ └──────────┘ └────────┘ │
└─────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────┐
│                     S3 Bucket                        │
│              (Static Website Hosting)                │
│  /en/index.html, /en/word/*.html, ...               │
└─────────────────────────────────────────────────────┘
```

## 2. コスト試算

| 項目 | 想定 | 月額 |
|------|------|------|
| S3 ストレージ | ~100MB | ~$0.02 |
| S3 リクエスト | 100万回 | ~$0.40 |
| CloudFront 転送 | 10GB | ~$0.85 |
| **合計** | | **~$1-5** |

## 3. S3 設定

### バケット作成

```bash
aws s3 mb s3://chinese-dictionary-site --region ap-northeast-1
```

### 静的ウェブホスティング有効化

```bash
aws s3 website s3://chinese-dictionary-site \
  --index-document index.html \
  --error-document 404.html
```

### バケットポリシー

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::chinese-dictionary-site/*"
    }
  ]
}
```

## 4. CloudFront 設定

- **オリジン**: S3 バケット
- **デフォルトルートオブジェクト**: index.html
- **価格クラス**: Price Class 100（北米・欧州のみ）または All
- **SSL証明書**: ACM で取得（無料）

## 5. GitHub Actions デプロイ

### .github/workflows/deploy.yml

```yaml
name: Deploy to S3

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: cd site && npm ci
      
      - name: Build
        run: cd site && npm run build
      
      - name: Deploy to S3
        uses: jakejarvis/s3-sync-action@v0.5.1
        with:
          args: --delete
        env:
          AWS_S3_BUCKET: ${{ secrets.AWS_S3_BUCKET }}
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_REGION: ap-northeast-1
          SOURCE_DIR: site/dist
      
      - name: Invalidate CloudFront
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} \
            --paths "/*"
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_REGION: ap-northeast-1
```

## 6. 代替案: Cloudflare Pages

**メリット:**
- 無料（帯域無制限）
- グローバルCDN
- 設定が簡単

### セットアップ

1. Cloudflare アカウント作成
2. Pages プロジェクト作成
3. GitHub リポジトリ連携
4. ビルド設定:
   - Framework: Astro
   - Build command: `npm run build`
   - Output directory: `dist`

## 7. ドメイン設定

### パターン

| 方式 | 例 | 推奨 |
|------|-----|:----:|
| サブディレクトリ | chineself.com/en/ | ⭐ |
| サブドメイン | en.chineself.com | |
| 新ドメイン | chinese-dict.com/en/ | |

### Route 53 設定（AWS）

```
Type: A
Name: www
Alias: CloudFront Distribution
```

### Cloudflare 設定

```
Type: CNAME
Name: www
Target: xxx.pages.dev
```
