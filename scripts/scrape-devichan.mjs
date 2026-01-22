/**
 * Scraping Script for devichan-chigoworld.com
 *
 * Usage:
 *   node scripts/scrape-devichan.mjs           # All pages
 *   node scripts/scrape-devichan.mjs --page 1  # Single page
 *   node scripts/scrape-devichan.mjs --dry-run # Preview without saving
 */

import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE_URL = 'https://www.devichan-chigoworld.com';
const CATEGORY_URL = `${BASE_URL}/category/use-china`;
const DATA_DIR = path.join(process.cwd(), 'data', 'ja');
const TOTAL_PAGES = 15;

// Parse arguments
const args = process.argv.slice(2);
const pageIndex = args.indexOf('--page');
const singlePage = pageIndex !== -1 ? parseInt(args[pageIndex + 1]) : null;
const dryRun = args.includes('--dry-run');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

/**
 * Get article URLs from a category page
 */
async function getArticleUrls(page, pageNum) {
  const url =
    pageNum === 1 ? CATEGORY_URL : `${CATEGORY_URL}/page/${pageNum}`;

  console.log(`Fetching: ${url}`);
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

  return await page.evaluate(() => {
    const links = document.querySelectorAll('a[href*="/use-china/"]');
    const urls = new Set();
    links.forEach((link) => {
      const href = link.getAttribute('href');
      if (href && !href.includes('/category/') && !href.includes('/page/')) {
        urls.add(href);
      }
    });
    return [...urls];
  });
}

/**
 * Scrape a single article page - extracts multiple expressions per article
 */
async function scrapeArticle(page, url) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

  return await page.evaluate(() => {
    const content =
      document.querySelector('.entry-content, article')?.textContent || '';

    // This site has multiple expressions per article
    // Format in content: "３１３．搖錢樹（yáoqiánshù）" followed by sections
    const results = [];

    // Split content by expression numbers (３１３．, ３１４．, etc.)
    // Match full-width or half-width numbers followed by period
    const expressionPattern = /([０-９\d]+)[．.]\s*([^（(\n]+)[（(]([^）)]+)[）)]/g;
    const expressions = [...content.matchAll(expressionPattern)];

    if (expressions.length === 0) {
      return null;
    }

    for (let i = 0; i < expressions.length; i++) {
      const match = expressions[i];
      // Convert full-width numbers to half-width
      const number = match[1].replace(/[０-９]/g, (s) =>
        String.fromCharCode(s.charCodeAt(0) - 0xfee0)
      );
      const chinese = match[2].trim();
      const pinyin = match[3].trim();

      // Find the section for this expression (until next expression or end)
      const startIdx = match.index;
      const endIdx =
        i < expressions.length - 1 ? expressions[i + 1].index : content.length;
      const section = content.slice(startIdx, endIdx);

      // Extract meaning from this section
      const meaningMatch = section.match(/【意味】\s*([^【\n]+)/);
      const meaning = meaningMatch ? meaningMatch[1].trim() : '';

      // Extract English translation
      const englishMatch = section.match(/【英語】\s*([^【\n]+)/);
      const english = englishMatch ? englishMatch[1].trim() : '';

      // Extract examples from 【使い方】 section
      const examples = [];
      const usageMatch = section.match(/【使い方】([\s\S]+?)(?=【|$)/);
      if (usageMatch) {
        const usageText = usageMatch[1];
        // Match patterns like: ①中国語文。（日本語訳。）
        const exampleMatches = usageText.matchAll(
          /[①②③④⑤⑥⑦⑧⑨⑩]\s*([^①②③④⑤⑥⑦⑧⑨⑩。]+。?)[（(]([^）)]+)[）)]/g
        );
        for (const m of exampleMatches) {
          if (m[1] && m[2]) {
            examples.push({
              chinese: m[1].trim(),
              translation: m[2].trim(),
            });
          }
        }
      }

      // Determine category based on character count
      const isFourChar = chinese.length === 4;
      const category = isFourChar ? 'chengyu' : 'net';
      const categoryName = isFourChar
        ? '成語・四字熟語'
        : 'ネット用語・スラング';

      results.push({
        slug: `devichan-${number}`,
        chinese,
        pinyin,
        meaning,
        description: '',
        examples: examples.slice(0, 5),
        category,
        categoryName,
        relatedWords: [],
        sourceUrl: location.href,
        sourceEnglish: english || undefined,
      });
    }

    return results;
  });
}

/**
 * Main function
 */
async function main() {
  console.log('=== devichan-chigoworld.com Scraper ===');
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}`);
  console.log(`Pages: ${singlePage ? `page ${singlePage} only` : `1-${TOTAL_PAGES}`}`);
  console.log('');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Collect article URLs
  const allUrls = [];
  const startPage = singlePage || 1;
  const endPage = singlePage || TOTAL_PAGES;

  for (let i = startPage; i <= endPage; i++) {
    try {
      const urls = await getArticleUrls(page, i);
      console.log(`  Page ${i}: ${urls.length} articles found`);
      allUrls.push(...urls);
      await new Promise((r) => setTimeout(r, 1000)); // Rate limit
    } catch (e) {
      console.log(`  Page ${i}: ERROR - ${e.message}`);
    }
  }

  console.log(`\nTotal URLs collected: ${allUrls.length}`);
  console.log('');

  // Scrape each article (each article may contain multiple expressions)
  const results = { success: 0, skip: 0, error: 0 };

  for (let i = 0; i < allUrls.length; i++) {
    const url = allUrls[i];
    const progress = `[${i + 1}/${allUrls.length}]`;

    try {
      const dataList = await scrapeArticle(page, url);

      if (!dataList || dataList.length === 0) {
        console.log(`${progress} SKIP (no data): ${url}`);
        results.skip++;
        continue;
      }

      // Process each expression in the article
      for (const data of dataList) {
        const filePath = path.join(DATA_DIR, `${data.slug}.json`);

        if (fs.existsSync(filePath)) {
          console.log(`${progress} SKIP (exists): ${data.slug}`);
          results.skip++;
          continue;
        }

        if (dryRun) {
          console.log(`${progress} WOULD SAVE: ${data.slug} (${data.chinese})`);
          console.log(`    meaning: ${data.meaning}`);
          console.log(`    english: ${data.sourceEnglish || 'N/A'}`);
          console.log(`    examples: ${data.examples.length}`);
        } else {
          fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
          console.log(`${progress} SAVED: ${data.slug} (${data.chinese})`);
        }
        results.success++;
      }

      await new Promise((r) => setTimeout(r, 500)); // Rate limit
    } catch (e) {
      console.log(`${progress} ERROR: ${url}`);
      console.log(`    ${e.message}`);
      results.error++;
    }
  }

  await browser.close();

  // Summary
  console.log('\n=== Summary ===');
  console.log(`Success: ${results.success}`);
  console.log(`Skipped: ${results.skip}`);
  console.log(`Errors:  ${results.error}`);

  if (dryRun) {
    console.log('\n(Dry run - no files were written)');
  }
}

main().catch((e) => {
  console.error('Fatal error:', e);
  process.exit(1);
});
