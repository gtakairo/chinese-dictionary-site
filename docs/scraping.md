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

