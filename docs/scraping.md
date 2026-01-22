# データ収集（スクレイピング）

## 概要

| 項目 | 内容 |
|------|------|
| ツール | agent-browser (vercel-labs) |
| 入力 | chineself.com のサイトマップ |
| 出力 | `data/ja/*.json` |
| 方針 | 元サイトへのアクセスは1回のみ |
| 動作確認 | ✅ 2025-01-16 tangping で確認済み |

---

## 1. セットアップ

```bash
# 1. agent-browser インストール
npm install -g agent-browser

# 2. プロジェクトで Playwright をインストール
cd /path/to/chinese-dictionary-site
npm init -y
npm install playwright

# 3. Chromium ブラウザをダウンロード
npx playwright install chromium

# 4. 動作確認
agent-browser open https://chineself.com/tangping/
agent-browser snapshot --json | head -50
agent-browser close
```

## 2. スクレイピングフロー

```
[サイトマップ取得]
       ↓
[URL一覧抽出]（約2000件）
       ↓
[各ページをスクレイプ]
       ↓
[schema.md に従ってJSON化]
       ↓
[data/ja/ に保存]
       ↓
[バリデーション]
```

## 3. 単語ページのデータ抽出（実証済み）

### 3.1 ページを開く

```bash
agent-browser open https://chineself.com/tangping/
```

出力:
```
✓ 躺平 | 辞書に載ってない中国語
  https://chineself.com/tangping/
```

### 3.2 ページ構造を確認

```bash
agent-browser snapshot --json
```

### 3.3 データ抽出（JavaScript実行）

以下のスクリプトで全データを一括抽出：

```bash
agent-browser eval "(() => {
  const article = document.querySelector('article');
  const paragraphs = article.querySelectorAll('p');
  
  // p[1] = pinyin, p[2] = meaning, p[3] = description, p[4] = examples
  const pinyinText = paragraphs[1]?.textContent || '';
  const pinyinMatch = pinyinText.match(/（([^）]+)）/);
  const pinyin = pinyinMatch ? pinyinMatch[1] : '';
  
  const meaning = (paragraphs[2]?.textContent || '').replace('意味：', '').trim();
  const description = (paragraphs[3]?.textContent || '').trim();
  
  // Parse examples from p[4]
  const exampleText = paragraphs[4]?.textContent || '';
  const exampleMatches = exampleText.matchAll(/例：([^「]+)「([^」]+)」/g);
  const examples = [];
  for (const m of exampleMatches) {
    examples.push({ chinese: m[1].trim(), translation: m[2].trim() });
  }
  
  // Category
  const categoryLink = document.querySelector('a[href*=\"/category/\"]');
  const category = categoryLink ? categoryLink.getAttribute('href').match(/category\\/([^\\/]+)/)?.[1] || '' : '';
  const categoryName = categoryLink ? categoryLink.textContent.trim() : '';
  
  // Related words
  const relatedLinks = article.querySelectorAll('a[href*=\"chineself.com/\"]');
  const relatedWords = [];
  const currentSlug = location.pathname.replace(/\\//g, '');
  relatedLinks.forEach(link => {
    const href = link.getAttribute('href');
    const match = href.match(/chineself\\.com\\/([a-z0-9-]+)\\//);
    if (match && match[1] !== 'category' && match[1] !== currentSlug) {
      relatedWords.push(match[1]);
    }
  });
  
  // Slug from URL
  const slug = location.pathname.replace(/\\//g, '');
  
  // Chinese word from h1
  const chinese = document.querySelector('h1')?.textContent?.trim() || '';
  
  return JSON.stringify({
    slug: slug,
    chinese: chinese,
    pinyin: pinyin,
    meaning: meaning,
    description: description,
    examples: examples.slice(0, 5),
    category: category,
    categoryName: categoryName,
    relatedWords: [...new Set(relatedWords)],
    sourceUrl: location.href
  }, null, 2);
})()"
```

### 3.4 出力例

```json
{
  "slug": "tangping",
  "chinese": "躺平",
  "pinyin": "tǎng píng",
  "meaning": "頑張らずゴロゴロする、マイペースでのんびりする、欲張らず妥協する、仕事をしないで過ごす",
  "description": "欲がない安定志向（頑張らない、金持ちを目指さない...）",
  "examples": [
    {
      "chinese": "今天啥都不想做,躺平比较好",
      "translation": "今日は何もしたくない、マイペースにのんびり過ごすのがよい"
    }
  ],
  "category": "net",
  "categoryName": "ネット用語・スラング",
  "relatedWords": ["foxi", "neijuan", "45durensheng", "lanshi"],
  "sourceUrl": "https://chineself.com/tangping/"
}
```

### 3.5 セッションを閉じる

```bash
agent-browser close
```

## 4. サイトマップURL

```
https://chineself.com/wp-sitemap-posts-post-1.xml
https://chineself.com/wp-sitemap-posts-post-2.xml
https://chineself.com/wp-sitemap-posts-post-3.xml
https://chineself.com/wp-sitemap-posts-post-4.xml
https://chineself.com/wp-sitemap-posts-post-5.xml
```

## 5. ページ構造（chineself.com）

```
article
├── p[0]        # 空
├── p[1]        # 🔊 躺平（tǎng píng）  ← ピンイン抽出
├── p[2]        # 意味：...              ← meaning
├── p[3]        # 説明文...              ← description
├── p[4]        # 例：...「...」例：...   ← examples
└── p[5]        # 空

a[href*="/category/"]  ← カテゴリーリンク
article a[href*="chineself.com/"] ← 関連単語リンク
```

## 6. AIエージェントへの指示テンプレート

### 単一ページのスクレイプ

```
https://chineself.com/{slug}/ のデータを取得して data/ja/{slug}.json に保存してください。

1. agent-browser open https://chineself.com/{slug}/
2. 上記のJavaScriptでデータ抽出
3. JSONファイルとして保存
4. agent-browser close
```

### バッチスクレイプ

```
以下のURLリストから順番にデータを取得してください。

URLs:
- https://chineself.com/neijuan/
- https://chineself.com/foxi/
- https://chineself.com/yyds/

各URLに対して:
1. ページを開く
2. データ抽出
3. data/ja/{slug}.json に保存
4. 1秒待機（レート制限）
5. 次のURLへ

完了後、取得した単語数を報告してください。
```

## 7. 注意事項

- **レート制限**: 1秒に1リクエスト程度に抑える
- **エラーハンドリング**: 失敗したURLはログに記録
- **ページ構造の変化**: p[n] のインデックスがページによって異なる可能性あり
- **増分更新**: 既存ファイルがあればスキップ

## 8. トラブルシューティング

### Chromium が起動しない

```bash
# 依存ライブラリをインストール
npx playwright install-deps chromium
```

### agent-browser install が失敗する

```bash
# 手動で Playwright 経由でインストール
npm install playwright
npx playwright install chromium
```

### ページが読み込まれない

```bash
# ネットワーク待機を追加
agent-browser wait --load networkidle
```

---

# データソース2: devichan-chigoworld.com

## 概要

| 項目 | 内容 |
|------|------|
| URL | https://www.devichan-chigoworld.com/category/use-china |
| コンテンツ | 中国語フレーズ・表現（番号付き） |
| ページ数 | 15ページ（ページネーションあり） |
| 推定件数 | 約300〜400件 |
| 特徴 | 英語訳が含まれる |

## ページ構造

### 一覧ページ
```
URL: /category/use-china
     /category/use-china/page/2
     ...
     /category/use-china/page/15

各記事リンク: /use-china/{記事タイトル（URLエンコード）}
```

### 記事ページ構造
```
記事タイトル: ３１３．搖錢樹（yáo qián shù）

本文:
【意味】金のなる木
【英語】money tree
【使い方】
①例文1（日本語訳）
②例文2（日本語訳）
③例文3（日本語訳）
```

## データマッピング

| devichan-chigoworld | 既存スキーマ | 備考 |
|---------------------|-------------|------|
| 番号（313） | slug | `devichan-313` の形式 |
| 漢字（搖錢樹） | chinese | - |
| ピンイン（yáo qián shù） | pinyin | - |
| 【意味】 | meaning | 日本語 |
| 【英語】 | - | 英語翻訳時に利用可能 |
| 【使い方】①②③ | examples | chinese + japanese |

## 出力スキーマ

```json
{
  "slug": "devichan-313",
  "chinese": "搖錢樹",
  "pinyin": "yáo qián shù",
  "meaning": "金のなる木",
  "description": "",
  "examples": [
    {
      "chinese": "他是公司的搖錢樹",
      "japanese": "彼は会社の金のなる木だ"
    }
  ],
  "category": "chengyu",
  "categoryName": "成語・四字熟語",
  "relatedWords": [],
  "sourceUrl": "https://www.devichan-chigoworld.com/use-china/...",
  "sourceEnglish": "money tree"
}
```

**注意**: `sourceEnglish` フィールドを追加。英語翻訳時にそのまま利用可能。

## スクレイピングフロー

```
[ページ1〜15を順番に取得]
       ↓
[各ページから記事URLを抽出]
       ↓
[各記事ページにアクセス]
       ↓
[正規表現でデータ抽出]
  - 番号: /(\d+)．/
  - 中国語: /(\d+)．([^（]+)（/
  - ピンイン: /（([^）]+)）/
  - 意味: /【意味】([^【]+)/
  - 英語: /【英語】([^【]+)/
  - 例文: /【使い方】([\s\S]+)/
       ↓
[JSONファイルとして保存]
  data/ja/devichan-{番号}.json
       ↓
[カテゴリー推定（オプション）]
  - 成語/四字熟語 → chengyu
  - その他 → net
```

## スクリプト: scripts/scrape-devichan.mjs

```javascript
/**
 * Scraping Script for devichan-chigoworld.com
 *
 * Usage: node scripts/scrape-devichan.mjs [--page N] [--all]
 */

import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE_URL = 'https://www.devichan-chigoworld.com';
const CATEGORY_URL = `${BASE_URL}/category/use-china`;
const DATA_DIR = path.join(process.cwd(), 'data', 'ja');
const TOTAL_PAGES = 15;

// 記事URLを抽出
async function getArticleUrls(page, pageNum) {
  const url = pageNum === 1
    ? CATEGORY_URL
    : `${CATEGORY_URL}/page/${pageNum}`;

  await page.goto(url, { waitUntil: 'domcontentloaded' });

  return await page.evaluate(() => {
    const links = document.querySelectorAll('a[href*="/use-china/"]');
    const urls = new Set();
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href && !href.includes('/category/') && !href.includes('/page/')) {
        urls.add(href);
      }
    });
    return [...urls];
  });
}

// 記事データを抽出
async function scrapeArticle(page, url) {
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  return await page.evaluate(() => {
    const content = document.querySelector('.entry-content, article')?.textContent || '';
    const title = document.querySelector('h1')?.textContent || '';

    // タイトルから番号と中国語を抽出
    const titleMatch = title.match(/(\d+)．([^（]+)（([^）]+)）/);
    if (!titleMatch) return null;

    const number = titleMatch[1];
    const chinese = titleMatch[2].trim();
    const pinyin = titleMatch[3].trim();

    // 本文から各項目を抽出
    const meaningMatch = content.match(/【意味】([^【\n]+)/);
    const englishMatch = content.match(/【英語】([^【\n]+)/);
    const usageMatch = content.match(/【使い方】([\s\S]+?)(?=【|$)/);

    const meaning = meaningMatch ? meaningMatch[1].trim() : '';
    const english = englishMatch ? englishMatch[1].trim() : '';

    // 例文を抽出
    const examples = [];
    if (usageMatch) {
      const usageText = usageMatch[1];
      const exampleMatches = usageText.matchAll(/[①②③④⑤⑥⑦⑧⑨⑩]([^①②③④⑤⑥⑦⑧⑨⑩（]+)(?:（([^）]+)）)?/g);
      for (const m of exampleMatches) {
        if (m[1] && m[2]) {
          examples.push({
            chinese: m[1].trim(),
            japanese: m[2].trim()
          });
        }
      }
    }

    return {
      slug: `devichan-${number}`,
      chinese,
      pinyin,
      meaning,
      description: '',
      examples: examples.slice(0, 5),
      category: chinese.length === 4 ? 'chengyu' : 'net',
      categoryName: chinese.length === 4 ? '成語・四字熟語' : 'ネット用語・スラング',
      relatedWords: [],
      sourceUrl: location.href,
      sourceEnglish: english
    };
  });
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // 全ページから記事URLを収集
  const allUrls = [];
  for (let i = 1; i <= TOTAL_PAGES; i++) {
    console.log(`Collecting URLs from page ${i}/${TOTAL_PAGES}...`);
    const urls = await getArticleUrls(page, i);
    allUrls.push(...urls);
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log(`Found ${allUrls.length} articles`);

  // 各記事をスクレイプ
  let success = 0, skip = 0, error = 0;

  for (const url of allUrls) {
    try {
      const data = await scrapeArticle(page, url);
      if (!data) {
        console.log(`Skip (no data): ${url}`);
        skip++;
        continue;
      }

      const filePath = path.join(DATA_DIR, `${data.slug}.json`);
      if (fs.existsSync(filePath)) {
        console.log(`Skip (exists): ${data.slug}`);
        skip++;
        continue;
      }

      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`Saved: ${data.slug} (${data.chinese})`);
      success++;

      await new Promise(r => setTimeout(r, 500));
    } catch (e) {
      console.log(`Error: ${url} - ${e.message}`);
      error++;
    }
  }

  await browser.close();
  console.log(`\nDone: ${success} saved, ${skip} skipped, ${error} errors`);
}

main().catch(console.error);
```

## 実行方法

```bash
# 依存関係インストール（初回のみ）
npm install playwright
npx playwright install chromium

# スクレイピング実行
node scripts/scrape-devichan.mjs

# 特定ページのみ
node scripts/scrape-devichan.mjs --page 1
```

## 注意事項

- レート制限: 500ms〜1s間隔
- 既存ファイルはスキップ（増分更新対応）
- カテゴリーは4文字なら成語、それ以外はnetを仮設定
- 英語訳は `sourceEnglish` に保存（翻訳時に活用）

---

## 9. VS Code Copilot Agent での推奨方法

VS Codeのエージェントセキュリティ機能により、ターミナル経由でのファイル書き込みは毎回許可が必要になります。

### 推奨: fetch_webpage + create_file

許可不要で効率的にスクレイピングを行う方法：

1. **fetch_webpage** でページのHTMLを取得
2. 取得したデータからJSON構造を抽出
3. **create_file** でJSONファイルを保存

```
# AIエージェントへの指示例
fetch_webpageで https://chineself.com/{slug}/ を取得して、
ピンイン、意味、カテゴリを抽出し、
create_fileで data/ja/{slug}.json に保存してください。
```

### 非推奨: agent-browser eval + ターミナル書き込み

- `agent-browser eval` の出力にパスが含まれると、VS Codeがファイル書き込みと誤検出
- 毎回「File write operations detected」の許可ダイアログが表示される
- 自動許可設定では回避不可

### 複数URL一括取得

fetch_webpageは複数URLを同時に取得可能：

```
fetch_webpage(
  query="中国語 意味 ピンイン",
  urls=["https://chineself.com/word1/", "https://chineself.com/word2/", ...]
)
```

