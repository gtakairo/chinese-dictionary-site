# データスキーマ定義

## 概要

| 項目 | 内容 |
|------|------|
| 目的 | 収集するデータの構造を事前に定義 |
| 実行タイミング | スクレイピング前（最初に決める） |
| 出力形式 | JSON |
| 保存場所 | `data/{lang}/{slug}.json` |

---

## 1. 単語エントリー（WordEntry）

収集する基本データ。元サイトから1回だけ取得してローカルに保存する。

```typescript
interface WordEntry {
  // 識別子
  slug: string;           // URL用スラッグ（例: "tangping"）
  
  // 中国語情報（言語共通）
  chinese: string;        // 中国語表記（例: "躺平"）
  pinyin: string;         // ピンイン（例: "tǎng píng"）
  
  // 日本語コンテンツ（元サイトから取得）
  meaning: string;        // 意味
  description: string;    // 説明文
  examples: Example[];    // 例文
  
  // メタデータ
  category: string;       // カテゴリースラッグ
  relatedWords: string[]; // 関連単語のスラッグ
  sourceUrl: string;      // 元サイトURL
}

interface Example {
  chinese: string;        // 中国語例文
  translation: string;    // 翻訳
}
```

## 2. 必須フィールド vs オプション

| フィールド | 必須 | 優先度 | 備考 |
|-----------|:----:|:------:|------|
| slug | ✅ | 最高 | URLから生成 |
| chinese | ✅ | 最高 | ページタイトルから |
| pinyin | ✅ | 最高 | ページ内から抽出 |
| meaning | ✅ | 高 | 短い意味説明 |
| description | ⬜ | 中 | 詳細説明（あれば） |
| examples | ⬜ | 中 | 例文（あれば） |
| category | ✅ | 高 | カテゴリースラッグ |
| categoryName | ✅ | 高 | カテゴリー表示名（言語別） |
| relatedWords | ⬜ | 低 | 関連単語リンク |

## 3. カテゴリー定義

カテゴリーは `data/_meta/categories.json` で一元管理。

```typescript
interface Category {
  slug: string;      // URL用（例: "net"）
  ja: string;        // 日本語名
  en: string;        // 英語名
  ko: string;        // 韓国語名
  th: string;        // タイ語名
  count: number;     // 単語数
}
```

**主要カテゴリー（29種）：**
- net: ネット用語・スラング (2,063)
- chengyu: 成語・四字熟語 (1,495)
- fashion: ファッション・美容 (246)
- sport: 運動・スポーツ (224)
- jingji: 経済・ビジネス (180)
- car: 自動車 (174)
- ...他

## 3. ファイル構造

```
data/
├── ja/                          # 日本語（元データ）
│   ├── tangping.json
│   ├── neijuan.json
│   ├── yyds.json
│   └── ...
├── en/                          # 英語翻訳
│   └── ...（AIエージェントが生成）
├── ko/                          # 韓国語翻訳
│   └── ...
├── th/                          # タイ語翻訳
│   └── ...
└── _meta/                       # メタデータ
    ├── categories.json          # カテゴリー一覧
    ├── words-index.json         # 全単語インデックス
    └── scrape-log.json          # スクレイピングログ
```

## 4. サンプルデータ

### data/ja/tangping.json

```json
{
  "slug": "tangping",
  "chinese": "躺平",
  "pinyin": "tǎng píng",
  "meaning": "頑張らずゴロゴロする、マイペースでのんびりする",
  "description": "欲がない安定志向のこと。競争社会からの脱却を意味する若者のライフスタイル。",
  "examples": [
    {
      "chinese": "今天啥都不想做,躺平比较好",
      "translation": "今日は何もしたくない、マイペースにのんびり過ごすのがよい"
    }
  ],
  "category": "net",
  "relatedWords": ["foxi", "neijuan"],
  "sourceUrl": "https://chineself.com/tangping/"
}
```

### data/_meta/categories.json

```json
{
  "categories": [
    { "slug": "net", "ja": "ネット用語・スラング" },
    { "slug": "chengyu", "ja": "成語" },
    { "slug": "jinrong", "ja": "金融" }
  ]
}
```

## 5. 翻訳後のデータ

AIエージェントが翻訳時に生成するファイル：

### data/en/tangping.json

```json
{
  "slug": "tangping",
  "chinese": "躺平",
  "pinyin": "tǎng píng",
  "meaning": "to lie flat; to take it easy; to opt out of the rat race",
  "description": "A lifestyle philosophy rejecting hustle culture and embracing minimal effort.",
  "examples": [
    {
      "chinese": "今天啥都不想做,躺平比较好",
      "translation": "I don't want to do anything today, better to just lie flat"
    }
  ],
  "category": "net",
  "relatedWords": ["foxi", "neijuan"],
  "sourceUrl": "https://chineself.com/tangping/"
}
```

## 6. バリデーションルール

スクレイピング後にチェックするルール：

```typescript
function validateWordEntry(entry: WordEntry): boolean {
  // 必須フィールドチェック
  if (!entry.slug || !entry.chinese || !entry.pinyin || !entry.meaning) {
    return false;
  }
  
  // slugの形式チェック（英数字とハイフンのみ）
  if (!/^[a-z0-9-]+$/.test(entry.slug)) {
    return false;
  }
  
  // ピンインの形式チェック（声調記号を含む）
  if (!entry.pinyin.trim()) {
    return false;
  }
  
  return true;
}
```
