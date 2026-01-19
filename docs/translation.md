# 翻訳ワークフロー

## 概要

| 項目 | 内容 |
|------|------|
| 方式 | AIエージェントがコーディング中に実行 |
| 入力 | `data/ja/*.json` |
| 出力 | `data/{en,ko,th}/*.json` |
| 対象言語 | 英語(en)、韓国語(ko)、タイ語(th) |

---

## 1. 翻訳フロー

```
data/ja/tangping.json
        ↓
   [AIエージェント]
        ↓
   ┌────┴────┬────────────┐
   ↓         ↓            ↓
data/en/   data/ko/    data/th/
```

**ポイント**: 別途翻訳パイプラインは作らない。開発中にAIエージェントに依頼する。

## 2. 翻訳対象フィールド

| フィールド | 翻訳する | 備考 |
|-----------|:-------:|------|
| slug | ❌ | そのまま |
| chinese | ❌ | そのまま |
| pinyin | ❌ | そのまま |
| meaning | ✅ | 翻訳 |
| description | ✅ | 翻訳 |
| examples[].chinese | ❌ | そのまま |
| examples[].translation | ✅ | 翻訳 |
| category | ❌ | そのまま（slug） |
| relatedWords | ❌ | そのまま |
| sourceUrl | ❌ | そのまま |

## 3. AIエージェントへの指示例

### 単一ファイル翻訳

```
data/ja/tangping.json を英語に翻訳して data/en/tangping.json に保存してください。

翻訳対象:
- meaning
- description  
- examples[].translation

中国語のスラング・ネット用語は英語圏で理解しやすい表現にしてください。
```

### バッチ翻訳

```
data/ja/ 内の全JSONファイルを英語に翻訳してください。

1. 各ファイルを読み込む
2. meaning, description, examples[].translation を翻訳
3. data/en/{slug}.json に保存
4. 進捗を報告（10件ごと）

既に data/en/ に存在するファイルはスキップしてください。
```

## 4. 言語別の翻訳ガイドライン

### 英語 (en)

- スラング・ネット用語は英語圏の同等表現を探す
- 文化的背景の説明を追加（必要に応じて）
- 例: 「躺平」→ "lying flat" + "similar to 'quiet quitting' in Western context"

### 韓国語 (ko)

- 敬語レベル: 해요체（普通の丁寧語）
- 韓国のネット文化との対比を意識
- 漢字語の読み方は韓国語発音で

### タイ語 (th)

- 声調記号を正しく使用
- タイの若者言葉との対比
- 丁寧さのレベル: ค่ะ/ครับ を使う

## 5. 翻訳品質チェック

### 自動チェック

```typescript
function validateTranslation(ja: WordEntry, translated: WordEntry): boolean {
  // 翻訳対象外フィールドが変わっていないか
  if (ja.slug !== translated.slug) return false;
  if (ja.chinese !== translated.chinese) return false;
  if (ja.pinyin !== translated.pinyin) return false;
  
  // 翻訳フィールドが空でないか
  if (!translated.meaning?.trim()) return false;
  
  return true;
}
```

### 手動チェック（推奨）

- 最初の10件は目視確認
- ネイティブスピーカーによるレビュー（可能であれば）

## 6. 翻訳進捗管理

### data/_meta/translation-status.json

```json
{
  "en": {
    "completed": 500,
    "total": 2000,
    "lastUpdated": "2025-01-16T12:00:00Z"
  },
  "ko": {
    "completed": 0,
    "total": 2000,
    "lastUpdated": null
  },
  "th": {
    "completed": 0,
    "total": 2000,
    "lastUpdated": null
  }
}
```
