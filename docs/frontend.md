# フロントエンド設計

## 概要

| 項目 | 内容 |
|------|------|
| フレームワーク | Astro |
| スタイリング | Tailwind CSS |
| データソース | `data/{lang}/*.json` |
| 検索 | Fuse.js（クライアントサイド） |
| 出力 | 静的HTML |
| デザイン方針 | **モダンでユーザーフレンドリー** |

---

## 0. デザイン方針

### 0.1 基本コンセプト

| 項目 | 方針 |
|------|------|
| 元サイトとの関係 | **データ取得元のみ**。UIUXは完全に新規設計 |
| デザインスタイル | モダン、クリーン、読みやすい |
| ターゲット | 中国語学習者（初級〜中級） |
| 差別化ポイント | カテゴリ分類、検索UX、多言語対応 |

### 0.2 UI/UX 要件

```
┌─────────────────────────────────────────────────────────────┐
│  ヘッダー: ロゴ + 検索バー + 言語切替                        │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────┐  ┌─────────────────────────────────────────┐ │
│  │           │  │                                         │ │
│  │ サイドバー │  │            メインコンテンツ              │ │
│  │           │  │                                         │ │
│  │ カテゴリ   │  │  [広告スペース - 控えめに]               │ │
│  │ ナビ      │  │                                         │ │
│  │           │  │  単語詳細 / 一覧                         │ │
│  │           │  │                                         │ │
│  │           │  │  [広告スペース - 記事下]                  │ │
│  └───────────┘  └─────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  フッター: リンク + コピーライト                             │
└─────────────────────────────────────────────────────────────┘
```

**必須機能：**
- ✅ カテゴリーによる分類・フィルタリング
- ✅ インクリメンタル検索（入力中に候補表示）
- ✅ ピンイン・中国語・意味での検索
- ✅ 関連単語へのリンク
- ✅ 言語切り替え（1クリック）
- ✅ モバイルファースト・レスポンシブ

### 0.3 広告配置ガイドライン

```
広告配置の優先順位と制約：

1. ユーザー体験 > 広告収益
   - コンテンツの読みやすさを損なわない
   - スクロールを阻害しない

2. 許可される広告位置：
   - ヘッダー下（320x100 または 728x90）
   - 記事下（300x250 または レスポンシブ）
   - サイドバー下部（300x250）※デスクトップのみ
   - 関連単語セクション後

3. 禁止事項：
   - ポップアップ・オーバーレイ広告
   - 本文中への広告挿入
   - スクロール追従型広告
   - 音声自動再生広告
```

### 0.4 カラースキーム

```css
/* ライトモード */
--primary: #e53935;      /* 赤（中国を象徴） */
--primary-light: #ff6f60;
--primary-dark: #ab000d;
--background: #ffffff;
--surface: #f5f5f5;
--text-primary: #212121;
--text-secondary: #757575;

/* アクセント */
--accent-pinyin: #1976d2; /* ピンインの色 */
--accent-chinese: #212121; /* 漢字の色 */
```

---

## 1. URL構造

```
/{lang}/                          # ホーム
/{lang}/word/{slug}               # 単語詳細
/{lang}/category/{category}       # カテゴリー一覧
/{lang}/search                    # 検索ページ
/{lang}/browse                    # 単語一覧（A-Z/ピンイン順）
```

### 言語パス

| 言語 | パス | 例 |
|------|------|-----|
| 日本語 | /ja/ | /ja/word/tangping |
| 英語 | /en/ | /en/word/tangping |
| 韓国語 | /ko/ | /ko/word/tangping |
| タイ語 | /th/ | /th/word/tangping |

## 2. Astro プロジェクト構造

```
site/
├── src/
│   ├── pages/
│   │   ├── [lang]/
│   │   │   ├── index.astro           # ホーム
│   │   │   ├── word/
│   │   │   │   └── [slug].astro      # 単語詳細
│   │   │   ├── category/
│   │   │   │   └── [category].astro  # カテゴリー
│   │   │   └── search.astro          # 検索
│   │   └── index.astro               # リダイレクト（→ /en/）
│   ├── components/
│   │   ├── WordCard.astro
│   │   ├── SearchBox.astro
│   │   ├── LanguageSwitcher.astro
│   │   └── ...
│   ├── layouts/
│   │   └── BaseLayout.astro
│   └── lib/
│       ├── data.ts                   # データ読み込み
│       └── i18n.ts                   # 多言語対応
├── public/
│   └── ...
└── astro.config.mjs
```

## 3. データ読み込み

### src/lib/data.ts

```typescript
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), '../data');

export function getWord(lang: string, slug: string): WordEntry | null {
  const filePath = path.join(DATA_DIR, lang, `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

export function getAllWords(lang: string): WordEntry[] {
  const langDir = path.join(DATA_DIR, lang);
  const files = fs.readdirSync(langDir).filter(f => f.endsWith('.json'));
  return files.map(f => {
    return JSON.parse(fs.readFileSync(path.join(langDir, f), 'utf-8'));
  });
}

export function getWordsByCategory(lang: string, category: string): WordEntry[] {
  return getAllWords(lang).filter(w => w.category === category);
}
```

## 4. コンポーネント

### 主要コンポーネント

| コンポーネント | 機能 |
|--------------|------|
| WordCard | 単語カード（一覧表示用） |
| WordDetail | 単語詳細ページ |
| PinyinDisplay | ピンイン表示（声調色分け） |
| ExampleList | 例文リスト |
| SearchBox | 検索ボックス |
| LanguageSwitcher | 言語切り替え |
| CategoryNav | カテゴリーナビゲーション |

### WordCard.astro（例）

```astro
---
interface Props {
  word: WordEntry;
  lang: string;
}
const { word, lang } = Astro.props;
---

<a href={`/${lang}/word/${word.slug}`} class="block p-4 border rounded hover:shadow">
  <h3 class="text-xl font-bold">{word.chinese}</h3>
  <p class="text-gray-500">{word.pinyin}</p>
  <p class="mt-2">{word.meaning}</p>
</a>
```

## 5. 多言語対応（i18n）

### UIテキストの管理

```
src/
└── i18n/
    ├── en.json
    ├── ko.json
    ├── th.json
    └── ja.json
```

### src/i18n/en.json

```json
{
  "common": {
    "search": "Search",
    "categories": "Categories",
    "relatedWords": "Related Words",
    "examples": "Example Sentences",
    "home": "Home"
  },
  "word": {
    "meaning": "Meaning",
    "pronunciation": "Pronunciation",
    "description": "Description"
  }
}
```

## 6. 検索機能

### クライアントサイド検索（Fuse.js）

```typescript
// ビルド時に検索インデックスを生成
// public/search-index-{lang}.json

import Fuse from 'fuse.js';

const fuse = new Fuse(words, {
  keys: ['chinese', 'pinyin', 'meaning'],
  threshold: 0.3,
});

const results = fuse.search(query);
```

## 7. SEO対策

### 各ページのメタデータ

```astro
<head>
  <title>{word.chinese} ({word.pinyin}) - Chinese Dictionary</title>
  <meta name="description" content={word.meaning} />
  <link rel="alternate" hreflang="en" href={`/en/word/${word.slug}`} />
  <link rel="alternate" hreflang="ko" href={`/ko/word/${word.slug}`} />
  <link rel="alternate" hreflang="th" href={`/th/word/${word.slug}`} />
  <link rel="alternate" hreflang="ja" href={`/ja/word/${word.slug}`} />
</head>
```
