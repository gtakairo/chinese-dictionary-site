# 多言語中国語辞書サイト

## 概要

| 項目 | 内容 |
|------|------|
| 目的 | chineself.com の中国語辞書を多言語（EN/KO/TH）展開 |
| ホスティング | S3 + CloudFront（$1-5/月） |
| SSG | Astro |
| スクレイピング | agent-browser |
| 翻訳 | AIエージェントがコーディング中に実行 |

## ワークフロー

```
[1. データ定義]  →  [2. スクレイピング]  →  [3. ローカル保存]  →  [4. 翻訳・開発]  →  [5. デプロイ]
    ↓                    ↓                      ↓                    ↓
 schema.md          agent-browser           data/ja/*.json      data/en,ko,th/
```

**ポイント**: 元サイトへのアクセスは1回のみ。ローカルにデータを保持し、以降はローカルデータを参照。

## ドキュメント一覧

| ファイル | 内容 | 実行順 |
|----------|------|--------|
| [schema.md](./schema.md) | データ定義（収集前に決める） | 1 |
| [scraping.md](./scraping.md) | agent-browser でのデータ収集 | 2 |
| [translation.md](./translation.md) | 翻訳ワークフロー | 3 |
| [frontend.md](./frontend.md) | フロントエンド設計 | 4 |
| [infrastructure.md](./infrastructure.md) | インフラ・デプロイ | 5 |

## クイックスタート

```bash
# 1. agent-browser セットアップ
npm install -g agent-browser
agent-browser install

# 2. Astro プロジェクト作成
npm create astro@latest site
cd site && npm install

# 3. AIエージェントにデータ収集を依頼
# 「schema.md に基づいて chineself.com からデータを収集してください」
```

## ディレクトリ構造（予定）

```
chinese-dictionary-site/
├── docs/                    # ドキュメント
├── data/                    # 収集したデータ
│   ├── ja/                  # 日本語（元データ）
│   ├── en/                  # 英語翻訳
│   ├── ko/                  # 韓国語翻訳
│   └── th/                  # タイ語翻訳
└── site/                    # Astro サイト
```
